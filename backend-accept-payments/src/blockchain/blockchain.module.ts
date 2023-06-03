import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LastProcessedBlock,
  LastProcessedBlockSchema,
} from 'src/schemas/last-processed-block.schema';
import {
  ProcessedTx,
  ProcessedTxSchema,
} from 'src/schemas/processed-tx.schema';
import { SubAccount, SubAccountSchema } from '../schemas/sub-account.schema';
import { BlockchainService } from './blockchain.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubAccount.name, schema: SubAccountSchema },
      { name: ProcessedTx.name, schema: ProcessedTxSchema },
      { name: LastProcessedBlock.name, schema: LastProcessedBlockSchema },
    ]),
  ],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
