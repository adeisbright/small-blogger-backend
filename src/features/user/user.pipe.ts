import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import {z} from "zod"
import { UserDTO } from "./user.dto";
import { validationMessages } from "src/shared/utils/validation-messages";

const userSchema = z.object({
    email : z.string({
        required_error: validationMessages("email").required ,
        invalid_type_error: validationMessages("email").invalidType,
    }),
    username : z.string({
        required_error: validationMessages("username").required ,
        invalid_type_error: validationMessages("username").invalidType,
    }),
    password : z.string({
        required_error: validationMessages("password").required 
    }),
})
export class AddUserPipe implements PipeTransform{
    transform(value: UserDTO, metadata: ArgumentMetadata)  : UserDTO{
        try{
            const result = userSchema.parse(value)
            return value as UserDTO
        }catch(error){
            const errorMessages = error.issues.map((e : any) => e.message).join();
            throw new BadRequestException(errorMessages);
        }
    }
}