import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LastProcessedBlock,
  LastProcessedBlockSchema,
} from 'src/schemas/last-processed-block.schema';
import {
  BlockchainTx,
  BlockchainTxSchema,
} from 'src/schemas/blockchain-tx.schema';
import { SubAccount, SubAccountSchema } from '../schemas/sub-account.schema';
import { BlockchainService } from './blockchain.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubAccount.name, schema: SubAccountSchema },
      { name: BlockchainTx.name, schema: BlockchainTxSchema },
      { name: LastProcessedBlock.name, schema: LastProcessedBlockSchema },
    ]),
  ],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
