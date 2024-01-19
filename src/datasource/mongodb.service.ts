import { Model, UpdateQuery, _FilterQuery } from 'mongoose';
import { Post, PostDocument } from './mongodb/schemas/post.entity';
import { User, UserDocument } from './mongodb/schemas/user.entity';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

abstract class IGenericRepository<T> {
  abstract add(data: Partial<T>): Promise<T>;
  abstract getAll(
    param: _FilterQuery<T>,
    projection: string | string[],
    populate?: string | string[],
    limit?: number,
    skip?: number,
    sortField?: string,
  ): Promise<T[]>;
  abstract getOne(
    param: _FilterQuery<T>,
    projection: string | string[],
    populate?: string | string[],
  ): Promise<T | undefined>;
  abstract deleteOne(param: _FilterQuery<T>): Promise<any>;
  abstract updateOne(param: _FilterQuery<T>, data: UpdateQuery<T>): Promise<T>;
}

class MongoGenericRepository<T> implements IGenericRepository<T> {
  private readonly model: Model<T>;
  private populateField: string[] = [];
  constructor(model: Model<T>) {
    this.model = model;
  }
  add(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }
  getAll(
    param: _FilterQuery<T>,
    projection: string | string[],
    populate?: string | string[],
    limit?: number,
    skip?: number,
    sortField?: string,
  ): Promise<T[]> {
    return this.model
      .find(param)
      .populate(populate ? populate : this.populateField)
      .select(projection)
      .limit(limit || 10)
      .skip(skip || 0)
      .sort('_id' || sortField)
      .exec();
  }
  getOne(
    param: _FilterQuery<T>,
    projection: string | string[],
    populate?: string | string[],
  ): Promise<T | any> {
    return this.model
      .findOne(param)
      .populate(populate ? populate : this.populateField)
      .select(projection)
      .exec();
  }
  deleteOne(param: _FilterQuery<T>): Promise<any> {
    return this.model.findOneAndDelete(param).exec();
  }
  updateOne(param: _FilterQuery<T>, data: UpdateQuery<T>): Promise<T | any> {
    return this.model.findOneAndUpdate(param, data);
  }
}

export abstract class MongoDataServices {
  abstract posts: IGenericRepository<Post>;
  abstract users: IGenericRepository<User>;
}

@Injectable()
export class NoSqlServices
  implements MongoDataServices, OnApplicationBootstrap
{
  posts: MongoGenericRepository<Post>;
  users: MongoGenericRepository<User>;
  constructor(
    @InjectModel(Post.name, 'blogger')
    private BlogRespository: Model<PostDocument>,
    @InjectModel(User.name, 'blogger')
    private UserRepository: Model<UserDocument>,
  ) {}

  onApplicationBootstrap() {
    this.posts = new MongoGenericRepository<Post>(this.BlogRespository);
    this.users = new MongoGenericRepository<User>(this.UserRepository);
  }
}
