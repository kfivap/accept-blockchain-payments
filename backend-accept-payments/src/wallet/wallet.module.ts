import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlockchainTx,
  BlockchainTxSchema,
} from 'src/schemas/blockchain-tx.schema';
import { SubAccount, SubAccountSchema } from '../schemas/sub-account.schema';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubAccount.name, schema: SubAccountSchema },
      { name: BlockchainTx.name, schema: BlockchainTxSchema },
    ]),
  ],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
