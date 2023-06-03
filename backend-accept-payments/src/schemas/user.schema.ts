import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  login: string;

  @Prop()
  encryptedPhrase: string;

  @Prop()
  callbackUri: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
