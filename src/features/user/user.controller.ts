import { Controller, Req, Res , Body, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request , Response } from "express";
import { UserDTO } from "./user.dto";

@Controller("users")
export class UserController {
    constructor(
        private  readonly userService : UserService
    ){}

    async addUser(
        @Req() req  :Request , 
        @Res() res : Response , 
        @Body() body : UserDTO
    ){
        const user = await this.userService.addUser(body)
        return res.status(HttpStatus.OK).json({
            message : "Post Added",
            user
        })
    }
}