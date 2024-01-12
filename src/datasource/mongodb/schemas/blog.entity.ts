import { Schema, SchemaFactory , Prop } from "@nestjs/mongoose";
import { Document , HydratedDocument } from "mongoose";

export type BlogDocument = HydratedDocument<Blog>

@Schema({timestamps : true}) 
export class Blog extends Document {
    @Prop()
    title : string
}

export const BlogSchema = SchemaFactory.createForClass(Blog)