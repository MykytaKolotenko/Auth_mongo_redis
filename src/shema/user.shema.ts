import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: [true, 'Username is required'],
    unique: [true, 'Username is already registered'],
  })
  username: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: [true, 'Email is already registered'],
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
