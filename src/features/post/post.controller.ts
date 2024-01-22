import {
  Body,
  Controller,
  Get,
  HttpStatus,
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

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @PUBLIC()
  @Get()
  async getPosts(@Req() req: Request, @Res() res: Response) {
    const posts = await this.postService.getPosts();
    return res.status(HttpStatus.OK).json({
      message: 'Posts retrieved',
      posts,
    });
  }

  @Post()
  @UsePipes(AddPostPipe)
  async addPost(
    @Req() req: Request,
    @Res() res: Response,
    @Body() postData: any,
  ) {
    const post = await this.postService.addPost(postData);
    return res.status(HttpStatus.OK).json({
      message: 'Post Added',
      post,
    });
  }

  @Put('/:id')
  @UsePipes(AddPostPipe)
  async updatePost(
    @Req() req: Request,
    @Res() res: Response,
    @Param() id: string,
    @Body() postData: any,
  ) {
    const post = await this.postService.updatePost(id, postData);
    return res.status(HttpStatus.OK).json({
      message: 'Post Updated',
      post,
    });
  }

  @Delete('/:id')
  async removePost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    await this.postService.deletePost(id);
    return res.status(HttpStatus.OK).json({
      message: 'Post Removed',
    });
  }

  @Get('/:id')
  async getPost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const post = await this.postService.getPost(id);
    return res.status(HttpStatus.OK).json({
      message: 'Post Retrieved',
      post,
    });
  }
}
