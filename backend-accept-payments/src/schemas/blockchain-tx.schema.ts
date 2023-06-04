import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlockchainEnum } from 'src/enums/blockchain.enum';
import * as mongoose from 'mongoose';
import { SubAccount } from './sub-account.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class BlockchainTx {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubAccount',
    required: true,
  })
  subAccount: SubAccount;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ enum: BlockchainEnum, required: true })
  blockchain: BlockchainEnum;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String, required: true, unique: true })
  txHash: string;

  @Prop({ type: String, required: true })
  amount: string;

  @Prop({ type: Boolean, default: false })
  callbackSuccess?: boolean;

  @Prop({ type: Boolean, default: false })
  spentTxHash?: boolean;
}

export const BlockchainTxSchema = SchemaFactory.createForClass(BlockchainTx);
