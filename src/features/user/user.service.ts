import { BadRequestException, Injectable } from "@nestjs/common";
import { MongoDataServices } from "src/datasource/mongodb.service";
import { User } from "src/datasource/mongodb/schemas/user.entity";
import { ErrorService } from "src/shared/errors/errors.service";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly errorService : ErrorService , 
        private readonly mongoService : MongoDataServices
    ){}

    async addUser(userData : UserDTO) : Promise<User>{
        try{
            await this.checkForDuplicate(userData);
            const user = await this.mongoService.users.add(userData)
            return user
        }catch(e){
            return this.errorService.serviceError(e)
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
            ['email' , 'username'],
          );
    
          if (user) {
            throw new BadRequestException(
              'User already  exists',
            );
          }
          return user;
        } catch (e) {
          return Promise.reject(e);
        }
      }
}