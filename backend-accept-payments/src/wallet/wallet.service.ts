import {
  Injectable,
  OnApplicationBootstrap,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubAccount } from '../schemas/sub-account.schema';
import { BlockchainTx } from 'src/schemas/blockchain-tx.schema';
import { WithdrawDto } from 'src/dto/withdraw-fund.dto';
import { tokensConfigByName } from 'src/config/config';

import { BigNumber } from 'bignumber.js';

@Injectable()
export class WalletService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(SubAccount.name) private _subAccountModel: Model<SubAccount>,
    @InjectModel(BlockchainTx.name)
    private _processedTxModel: Model<BlockchainTx>,
  ) {}

  onApplicationBootstrap() {}

  async callbackProcessedTx() {
    // todo
  }

  async withdraw(data: WithdrawDto) {
    const { blockchain, token, amount, destination } = data;
    const configForToken = tokensConfigByName[token];
    if (!configForToken) {
      throw new BadRequestException('token not in config');
    }
    if (new BigNumber(amount).isLessThan(configForToken.minimalWithdraw)) {
      throw new ConflictException('amount less than minimal withdraw');
    }
  }
}
