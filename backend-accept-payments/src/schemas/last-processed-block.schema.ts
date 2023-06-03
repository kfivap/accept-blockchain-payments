import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlockchainEnum } from 'src/enums/blockchain.enum';

@Schema({ timestamps: true })
export class LastProcessedBlock {
  @Prop({ enum: BlockchainEnum, required: true })
  blockchain: BlockchainEnum;

  @Prop({ type: Number })
  number: number;
}

export const LastProcessedBlockSchema =
  SchemaFactory.createForClass(LastProcessedBlock);
