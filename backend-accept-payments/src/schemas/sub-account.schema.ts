import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlockchainEnum } from '../enums/blockchain.enum';
import { User } from './user.schema';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class SubAccount {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ enum: BlockchainEnum, required: true })
  blockchain: BlockchainEnum;

  @Prop({ required: true })
  identifier: string;

  @Prop({ required: true, type: Number })
  derivationCounter: number;
}

export const SubAccountSchema = SchemaFactory.createForClass(SubAccount);
