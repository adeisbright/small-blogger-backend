import { Schema, SchemaFactory , Prop } from "@nestjs/mongoose";
import { Document , HydratedDocument } from "mongoose";

export type PostDocument = HydratedDocument<Post>

@Schema({timestamps : true}) 
export class Post extends Document {
    @Prop()
    title : string
}

export const PostSchema = SchemaFactory.createForClass(Post)