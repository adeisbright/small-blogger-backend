import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MongoDataServices } from 'src/datasource/mongodb.service';
import { User } from 'src/datasource/mongodb/schemas/user.entity';
import { ErrorService } from 'src/shared/errors/errors.service';
import { UserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';

@Injectable()
export class UserService {
  private secret: string;
  private appName: string;
  constructor(
    private readonly errorService: ErrorService,
    private readonly mongoService: MongoDataServices,
    private readonly jwtService: JwtService,
  ) {
    this.secret = config.jwtSecret;
    this.appName = config.appName;
  }

  async addUser(userData: UserDTO): Promise<User> {
    try {
      await this.checkForDuplicate(userData);
      const user = await this.mongoService.users.add(userData);
      return user;
    } catch (e) {
      return this.errorService.serviceError(e);
    }
  }

  async checkForDuplicate(body: UserDTO): Promise<User> {
    try {
      const { email, username } = body;
      body.email = email.toLowerCase();

      const queryParam: Record<string, any>[] = [
        {
          username: username.toLowerCase(),
        },
        { email: body.email },
      ];

      const user: any = await this.mongoService.users.getOne(
        { $or: queryParam },
        ['email', 'username'],
      );

      if (user) {
        throw new BadRequestException('User already  exists');
      }
      return user;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async handleLogin(body: UserDTO): Promise<string> {
    try {
      const { email, password } = body;
      const user = await this.getUser({ email });
      await this.verifyPassword(password, user?.password as string);
      const token = await this.generateAuthToken(
        email,
        user?.username as string,
        user?._id,
      );
      return token;
    } catch (e) {
      return this.errorService.serviceError(e);
    }
  }

  async getUser(param: Record<string, any>): Promise<User | undefined> {
    try {
      const user = await this.mongoService.users.getOne(param, []);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (e) {
      return this.errorService.serviceError(e);
    }
  }

  async generateAuthToken(
    email: string,
    username: string,
    id: string,
  ): Promise<string> {
    try {
      const payload = {
        email,
        username,
        id,
        audience: email,
        issuer: this.appName,
        subject: id,
        sub: email,
      };
      const token = await this.jwtService.signAsync(payload, {
        secret: this.secret,
        expiresIn: 60 * 60 * 10,
      });
      return token;
    } catch (e) {
      throw new Error('Failed to generate authentication token');
    }
  }

  private async verifyPassword(
    normalPassword: string,
    hashedPassword: string,
  ): Promise<boolean | undefined> {
    try {
      const isValidUser = await bcrypt.compare(normalPassword, hashedPassword);
      if (!isValidUser) {
        throw new UnauthorizedException('Provide correct login details');
      }
      return true;
    } catch (e) {
      return this.errorService.serviceError(e);
    }
  }
}
