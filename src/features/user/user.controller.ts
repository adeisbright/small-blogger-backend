import { Controller, Req, Res , Body, HttpStatus , Post, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request , Response } from "express";
import { UserDTO } from "./user.dto";
import { AddUserPipe } from "./user.pipe";
import { SuccessResponse } from "src/shared/response/succes-response";

@Controller()
export class UserController {
    constructor(
        private  readonly userService : UserService , 
        private readonly successResponse : SuccessResponse
    ){}

    @Post("/registration")
    @UsePipes(AddUserPipe)
    async addUser(
        @Req() req  :Request , 
        @Res() res : Response , 
        @Body() body : UserDTO
    ){
        const user = await this.userService.addUser(body)
        return this.successResponse.ok(res, req, { data: user });
    }
}