import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MongoDataServices,
  NoSqlServices,
} from 'src/datasource/mongodb.service';
import { Post, PostSchema } from 'src/datasource/mongodb/schemas/post.entity';
import { User, UserSchema } from 'src/datasource/mongodb/schemas/user.entity';
import { PostService } from './post/post.service';
import { ErrorService } from 'src/shared/errors/errors.service';
import { PostController } from './post/post.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { SuccessResponse } from 'src/shared/response/succes-response';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './user/auth.guard';

@Module({
  controllers: [PostController, UserController],
  providers: [
    {
      provide: MongoDataServices,
      useClass: NoSqlServices,
    },
    PostService,
    UserService,
    ErrorService,
    SuccessResponse,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
        },
        {
          name: Post.name,
          schema: PostSchema,
        },
      ],
      'blogger',
    ),
    JwtModule.register({
      global: true,
    }),
  ],
})
export class FeaturesModule {}
