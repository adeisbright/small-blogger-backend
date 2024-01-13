import { Model } from "mongoose"
import { Post, PostDocument } from "./mongodb/schemas/post.entity"
import { User, UserDocument } from "./mongodb/schemas/user.entity"
import { Injectable, OnApplicationBootstrap } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"

abstract class IGenericRepository<T> {
    abstract add(data : Partial<T>) : Promise<T>
    abstract getAll() : Promise<T[]>
}

class MongoGenericRepository<T> implements IGenericRepository<T> {
    private readonly model : Model<T>
    constructor(model : Model<T>){
        this.model = model
    }
    add(data : Partial<T>) : Promise<T> {
        return this.model.create(data)
    }
    getAll() : Promise<T[]> {
        return this.model.find()
    }
}

export abstract class MongoDataServices {
    abstract posts : IGenericRepository<Post> 
    abstract users : IGenericRepository<User>
}

@Injectable() 
export class NoSqlServices implements MongoDataServices, OnApplicationBootstrap {
    posts : MongoGenericRepository<Post> ; 
    users : MongoGenericRepository<User>
    constructor(
        @InjectModel(Post.name , "blogger") private BlogRespository : Model<PostDocument> , 
        @InjectModel(User.name , "blogger") private UserRepository : Model<UserDocument>
    ){}

    onApplicationBootstrap() {
        this.posts = new MongoGenericRepository<Post>(this.BlogRespository)
        this.users = new MongoGenericRepository<User>(this.UserRepository)
    }
}