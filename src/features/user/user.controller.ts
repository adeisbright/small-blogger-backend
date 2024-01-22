import { Controller, Req, Res, Body, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { UserDTO } from './user.dto';
import { AddUserPipe, LoginPipe } from './user.pipe';
import { SuccessResponse } from 'src/shared/response/succes-response';
import { PUBLIC } from './public-route-decorator';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly successResponse: SuccessResponse,
  ) {}

  @PUBLIC()
  @Post('/registration')
  @UsePipes(AddUserPipe)
  async addUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: UserDTO,
  ) {
    const user = await this.userService.addUser(body);
    return this.successResponse.ok(res, req, { data: user });
  }

  @PUBLIC()
  @Post('/login')
  @UsePipes(LoginPipe)
  async handleLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: UserDTO,
  ) {
    const message = await this.userService.handleLogin(body);
    return this.successResponse.ok(res, req, { data: message });
  }
}
