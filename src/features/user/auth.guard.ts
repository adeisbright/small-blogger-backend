import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config } from 'src/config';
import { PUBLIC_ROUTE } from 'src/constant';
import { ErrorService } from 'src/shared/errors/errors.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private secret: string;
  constructor(
    private readonly errorService: ErrorService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    this.secret = config.jwtSecret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const IS_PUBLIC = this.reflector.getAllAndOverride(PUBLIC_ROUTE, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (IS_PUBLIC) return true;
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Provide authorization token');
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.secret,
      });
      this.validateTokenExpiration(payload.exp);
      return true;
    } catch (e) {
      return this.errorService.serviceError(e);
    }
  }

  extractTokenFromHeader = (request: Request) => {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };

  private validateTokenExpiration(expiration: number): void {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (expiration < currentTimestamp) {
      throw new UnauthorizedException('JWT token has expired');
    }
  }
}
