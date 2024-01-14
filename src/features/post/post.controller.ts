import { Body, Controller, Get, HttpStatus, Post, Req, Res, UsePipes } from "@nestjs/common";
import { PostService } from "./post.service";
import { Request, Response } from "express";
import { AddPostPipe } from "./post.pipe";

@Controller("posts")
export class PostController{
    constructor(
        private postService :PostService
    ){}
    @Get() 
    async getPosts(
        @Req() req : Request , 
        @Res() res : Response
    ){
        const posts = await this.postService.getPosts() 
        return res.status(HttpStatus.OK).json({
            message : "Posts retrieved",
            posts
        })
    }

    @Post() 
    @UsePipes(AddPostPipe)
    async addPost(
        @Req() req : Request , 
        @Res() res : Response , 
        @Body() postData : any
    ){
        const post = await this.postService.addPost(postData) 
        return res.status(HttpStatus.OK).json({
            message : "Post Added",
            post
        })
    }
}