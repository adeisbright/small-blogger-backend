import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Request, Response } from 'express';
import { AddPostPipe } from './post.pipe';
import { PUBLIC } from '../user/public-route-decorator';
import { SuccessResponse } from 'src/shared/response/succes-response';

@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private readonly successResponse: SuccessResponse,
  ) {}

  @PUBLIC()
  @Get()
  async getPosts(@Req() req: Request, @Res() res: Response) {
    const posts = await this.postService.getPosts();
    return this.successResponse.ok(res, req, { data: posts });
  }

  @Post()
  @UsePipes(AddPostPipe)
  async addPost(
    @Req() req: Request,
    @Res() res: Response,
    @Body() postData: any,
  ) {
    const post = await this.postService.addPost(postData);
    return this.successResponse.ok(res, req, { data: post });
  }

  @Put('/:id')
  @UsePipes(AddPostPipe)
  async updatePost(
    @Req() req: Request,
    @Res() res: Response,
    @Param() id: string,
    @Body() postData: any,
  ) {
    const post = await this.postService.editPost(id, postData);
    return this.successResponse.ok(res, req, { data: post });
  }

  @Delete('/:id')
  async removePost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    await this.postService.deletePost(id);
    return this.successResponse.ok(res, req, { data: 'Post was removed' });
  }

  @Get('/:id')
  async getPost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const post = await this.postService.getPost(id);
    return this.successResponse.ok(res, req, { data: post });
  }
}
