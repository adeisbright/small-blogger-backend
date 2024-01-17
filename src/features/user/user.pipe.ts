import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import {z} from "zod"
import { UserDTO } from "./user.dto";

const userSchema = z.object({
    email : z.string({
        required_error: "email is required",
        invalid_type_error: "email must be a string",
    }),
    username : z.string() , 
    password : z.string(),
})
export class AddUserPipe implements PipeTransform{
    transform(value: UserDTO, _: ArgumentMetadata)  : UserDTO{
        try{
            const result = userSchema.parse(value)
            return value as UserDTO
        }catch(error){
            const errorMessages = error.issues.map((e : any) => e.message).join();
            throw new BadRequestException(errorMessages);
        }
    }
}