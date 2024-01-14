import { Injectable } from "@nestjs/common";
import { MongoDataServices } from "src/datasource/mongodb.service";
import { Post } from "src/datasource/mongodb/schemas/post.entity";
import { ErrorService } from "src/shared/errors/errors.service";
@Injectable()
export class PostService {
    constructor(
        private readonly errorService : ErrorService , 
        private readonly mongoDataServices : MongoDataServices
    ){}
    
    async addPost(postData : Partial<Post>){
        try{
            const post = await this.mongoDataServices.posts.add(postData)
            return post
        }catch(e:any){
            return this.errorService.serviceError(e)
        }
    }

    async getPosts(){
        try{
            const posts = await this.mongoDataServices.posts.getAll({} , [])
            return posts
        }catch(e:any){
            return this.errorService.serviceError(e)
        }
    }

    async deletePost(_id : string) : Promise<boolean>{
        try{
            const posts = await this.mongoDataServices.posts.deleteOne({_id})
            return true
        }catch(e:any){
            return this.errorService.serviceError(e)
        }
    }
}