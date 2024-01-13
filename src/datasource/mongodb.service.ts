import { Model } from "mongoose"
import { Blog, BlogDocument } from "./mongodb/schemas/blog.entity"
import { User, UserDocument } from "./mongodb/schemas/user.entity"
import { Injectable, OnApplicationBootstrap } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"

abstract class IGenericRepository<T> {
    abstract add(data : Partial<T>) : Promise<T>
}

class MongoGenericRepository<T> implements IGenericRepository<T> {
    private readonly model : Model<T>
    constructor(model : Model<T>){
        this.model = model
    }
    add(data : Partial<T>) : Promise<T> {
        return this.model.create(data)
    }
}

export abstract class MongoDataServices {
    abstract blogs : IGenericRepository<Blog> 
    abstract users : IGenericRepository<User>
}

@Injectable() 
export class NoSqlServices implements MongoDataServices, OnApplicationBootstrap {
    blogs : MongoGenericRepository<Blog> ; 
    users : MongoGenericRepository<User>
    constructor(
        @InjectModel(Blog.name , "blogger") private BlogRespository : Model<BlogDocument> , 
        @InjectModel(User.name , "blogger") private UserRepository : Model<UserDocument>
    ){}

    onApplicationBootstrap() {
        this.blogs = new MongoGenericRepository<Blog>(this.BlogRespository)
        this.users = new MongoGenericRepository<User>(this.UserRepository)
    }
}