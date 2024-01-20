import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { ErrorService } from "src/shared/errors/errors.service";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private readonly errorService : ErrorService
    ){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try{
            const ctx = context.switchToHttp() 
            const request = ctx.getRequest<Request>()
            const token = this.extractTokenFromHeader(request) 
            if (!token) {
                throw new UnauthorizedException('Provide authorization token');
            }
            return true
        }catch(e){
            return this.errorService.serviceError(e)
        }
    }

    extractTokenFromHeader = (request : Request) =>{
        const [type , token] = request.headers.authorization?.split(' ') ?? []
        return type === "Bearer" ? token : undefined
    }
}