import { Controller, Req, Res , Body, HttpStatus , Post, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request , Response } from "express";
import { UserDTO } from "./user.dto";
import { AddUserPipe } from "./user.pipe";

@Controller("users")
export class UserController {
    constructor(
        private  readonly userService : UserService
    ){}

    @Post()
    @UsePipes(AddUserPipe)
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