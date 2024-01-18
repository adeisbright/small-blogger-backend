import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import * as bcrypt from "bcrypt"

export type UserDocument = HydratedDocument<User>
@Schema({timestamps : true})
export class User extends Document {
    @Prop({unique : true , index : true})
    email : string

    @Prop()
    password : string

    @Prop({unique : true})
    username : string
}


export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save' , async function (next : any){
    if(this.password){
        const salt = await bcrypt.genSalt(10) 
        this.password = await bcrypt.hash(this.password , salt)
    }
    next()
})