import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDataServices, NoSqlServices } from 'src/datasource/mongodb.service';
import { Post, PostSchema} from 'src/datasource/mongodb/schemas/post.entity';
import { User, UserSchema } from 'src/datasource/mongodb/schemas/user.entity';
import { PostService } from './post/post.service';
import { ErrorService } from 'src/shared/errors/errors.service';
import { PostController } from './post/post.controller';

@Module({
    controllers : [
        PostController
    ],
    providers : [
        {
            provide : MongoDataServices , 
            useClass : NoSqlServices
        } , 
        PostService , 
        ErrorService
    ],
    imports :[
        MongooseModule.forFeature([
            {
                name :User.name , 
                schema : UserSchema
            },
            {
                name : Post.name , 
                schema : PostSchema
            }
        ] , "blogger")
    ]
})
export class FeaturesModule {}
