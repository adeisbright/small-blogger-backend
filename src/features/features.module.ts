import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/datasource/mongodb/schemas/blog.entity';
import { User, UserSchema } from 'src/datasource/mongodb/schemas/user.entity';

@Module({
    providers : [],
    imports :[
        MongooseModule.forFeature([
            {
                name :User.name , 
                schema : UserSchema
            },
            {
                name : Blog.name , 
                schema : BlogSchema
            }
        ] , "blogger")
    ]
})
export class FeaturesModule {}
