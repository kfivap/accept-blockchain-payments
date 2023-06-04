import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubAccount, SubAccountDocument } from '../schemas/sub-account.schema';
import { ethers } from 'ethers';
import { LastProcessedBlock } from 'src/schemas/last-processed-block.schema';
import { BlockchainEnum } from 'src/enums/blockchain.enum';
import { BlockchainTx } from 'src/schemas/blockchain-tx.schema';
import { TokenEnum } from 'src/enums/tokens.enum';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { tokenConfigRow, tokensConfigByAddress } from 'src/config/config';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class BlockchainService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(SubAccount.name) private _subAccountModel: Model<SubAccount>,
    @InjectModel(BlockchainTx.name)
    private _blockchainTxModel: Model<BlockchainTx>,
    @InjectModel(LastProcessedBlock.name)
    private _lastProcessedBlockModel: Model<LastProcessedBlock>,
  ) {}

  onApplicationBootstrap() {
    this.fetchEthTransactions(BlockchainEnum.BSC);
    this.fetchEthTransactions(BlockchainEnum.ETH);
  }

  async fetchEthTransactions(blockchain: BlockchainEnum) {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env[`${blockchain}_RPC_ENDPOINT`],
    );
    const confirmations = 6;
    const batchSize = 5;

    const lastBlock = await this._lastProcessedBlockModel.findOne({
      blockchain,
    });

    let blockNumber = lastBlock.number || 0;
    let latestBlockNumber = await provider.getBlockNumber();
    while (true) {
      if (latestBlockNumber - confirmations - batchSize <= blockNumber) {
        console.log(
          `block ${blockNumber} reached unconfirmed ${latestBlockNumber}, sleep`,
        );
        await new Promise((r) => {
          setTimeout(r, 60000);
        });
        latestBlockNumber = await provider.getBlockNumber();
        continue;
      }
      const promises = [];
      for (let i = 0; i < batchSize; i++) {
        promises.push(provider.getBlockWithTransactions(blockNumber + i));
      }
      const blocks = await Promise.all(promises);

      for (const block of blocks) {
        console.log(
          `Processing block ${block.number} ${blockchain}, ${
            latestBlockNumber - block.number
          } to latest `,
        );
        if (block) {
          if (block.transactions.length > 0) {
            for (const tx of block.transactions) {
              //   console.log(new Date(), tx.hash);
              if (!tx.to) {
                continue;
              }
              const erc20 = tokensConfigByAddress[tx.to.toLocaleLowerCase()];
              if (erc20) {
                await this._handleErc20(blockchain, tx, erc20);
              } else {
                await this._handleEthNative(blockchain, tx);
              }
            }
          }
          await this._lastProcessedBlockModel.updateOne(
            { blockchain },
            { $set: { number: block.number } },
            { upsert: true },
          );
          blockNumber = block.number;
        }
      }
    }
  }

  private async _handleEthNative(
    blockchain: BlockchainEnum,
    tx: TransactionResponse,
  ) {
    const ourSubAccount = await this._subAccountModel.findOne({
      blockchain,
      address: tx.to.toLocaleLowerCase(),
    });
    if (ourSubAccount) {
      await this._saveTx({
        subAccount: ourSubAccount,
        user: ourSubAccount.user,
        blockchain,
        token: TokenEnum.NATIVE_BNB,
        amount: tx.value.toString(),
        txHash: tx.hash,
      });
    }
  }

  private async _handleErc20(
    blockchain: BlockchainEnum,
    tx: TransactionResponse,
    token: tokenConfigRow,
  ) {
    const methodHash = tx.data.slice(0, 10);
    const isTransfer = methodHash === '0xa9059cbb';
    const isTransferFrom = methodHash === '0x23b872dd';

    let amountToSave;
    let assetsTo;
    if (isTransfer) {
      const transferIface = new ethers.utils.Interface([
        'function transfer(address,uint256)',
      ]);
      const parsedTransferData = transferIface.parseTransaction({
        data: tx.data,
      });

      if (parsedTransferData && parsedTransferData.name === 'transfer') {
        assetsTo = parsedTransferData.args[0].toString();
        amountToSave = parsedTransferData.args[1].toString();
      }
    } else if (isTransferFrom) {
      const transferFromIface = new ethers.utils.Interface([
        'function transferFrom(address,address,uint256)',
      ]);

      const parsedTransferFromData = transferFromIface.parseTransaction({
        data: tx.data,
      });
      if (
        parsedTransferFromData &&
        parsedTransferFromData.name === 'transferFrom'
      ) {
        assetsTo = parsedTransferFromData.args[1].toString();
        amountToSave = parsedTransferFromData.args[2].toString();
      }
    }

    if ((isTransferFrom || isTransfer) && amountToSave) {
      const success = await this._checkEthTxSuccess(tx);
      if (!success) {
        console.log(`tx ${tx.hash} is no success, skip`);
      }
      const ourSubAccount = await this._subAccountModel.findOne({
        blockchain,
        address: assetsTo.toLocaleLowerCase(),
      });
      if (ourSubAccount) {
        await this._saveTx({
          subAccount: ourSubAccount,
          user: ourSubAccount.user,
          blockchain,
          token: token.name,
          txHash: tx.hash,
          amount: amountToSave,
        });
      }
    }
  }

  private async _checkEthTxSuccess(tx: TransactionResponse): Promise<boolean> {
    try {
      await tx.wait();
      return true;
    } catch (e) {
      if (e.message.includes('transaction failed')) {
        return false;
      }
    }
  }

  private async _saveTx(data: BlockchainTx) {
    const {
      blockchain,
      token,
      txHash: _txHash,
      amount,
      subAccount,
      user,
    } = data;
    console.log('savetx', data);
    const txHash = _txHash.toLocaleLowerCase();
    if (await this._blockchainTxModel.findOne({ txHash })) {
      console.log('savetx already exists, skip', data);
      return;
    }
    const createdSubAccount = new this._blockchainTxModel({
      subAccount: (subAccount as unknown as SubAccountDocument)._id,
      user: (user as unknown as UserDocument)._id,
      blockchain,
      token,
      txHash: txHash.toLocaleLowerCase(),
      amount,
      callbackSuccess: false,
    });
    await createdSubAccount.save();
  }
}
