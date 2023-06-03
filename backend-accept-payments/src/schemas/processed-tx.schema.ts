import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlockchainEnum } from 'src/enums/blockchain.enum';

@Schema({ timestamps: true })
export class ProcessedTx {
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
}

export const ProcessedTxSchema = SchemaFactory.createForClass(ProcessedTx);
