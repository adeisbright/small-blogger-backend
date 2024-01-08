import { Injectable } from "@nestjs/common";
@Injectable()
export class BlogService {
    private posts : Record<string,any> = [
        // {
        //     id : 1,
        //     title : "Hello",
        //     content : "World"
        // }
    ]
    async getPosts(){
        try{
            return this.posts 
        }catch(e){
            return e
        }
    }
}