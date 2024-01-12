import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>
@Schema({timestamps : true})
export class User extends Document {
    @Prop({unique : true , index : true})
    email : string

    @Prop()
    password : string
}

export const UserSchema = SchemaFactory.createForClass(User)