import { Injectable, ConflictException } from '@nestjs/common';
import { ethers } from 'ethers';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { encryptSeedPhrase } from '../auth/auth.lib';
import { GetSubAccountDto } from '../dto/get-sub-account.dto';
import { SubAccount } from '../schemas/sub-account.schema';
import { BlockchainEnum } from 'src/enums/blockchain.enum';
import { generateEthAddress } from 'src/crypto/evm.lib';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<User>,
    @InjectModel(SubAccount.name) private _subAccountModel: Model<SubAccount>,
  ) {}

  generateRandomSeedPhrase() {
    const phrase = ethers.Wallet.createRandom().mnemonic.phrase;
    return { phrase };
  }

  async registerUser(data: RegisterUserDto) {
    const {
      login,
      seedPhrase: decryptedSeedPhrase,
      password,
      callbackUri,
    } = data;

    const encryptedPhrase = encryptSeedPhrase(decryptedSeedPhrase, password);
    const createdUser = new this._userModel({
      login,
      encryptedPhrase,
      callbackUri,
    });
    await createdUser.save();
    return { userId: createdUser._id.toString() };
  }

  async getSubAccount(
    data: GetSubAccountDto,
    user: UserDocument,
    seedPhrase: string,
  ) {
    const { blockchain, identifier } = data;
    const subAccountExists = await this._subAccountModel.findOne({
      user: user._id,
      identifier,
      blockchain,
    });
    if (subAccountExists) {
      return subAccountExists;
    }

    const currentMax = await this._getMaxSubAccountDerivationCounter(user);
    const derivationCounter = currentMax + 1;

    let address: string;
    // todo crypto module, move logic out of here
    if (
      blockchain === BlockchainEnum.BSC ||
      blockchain === BlockchainEnum.ETH
    ) {
      address = generateEthAddress(seedPhrase, derivationCounter);
    } else {
      throw new ConflictException('blockchain not implemented yet');
    }

    const createdSubAccount = new this._subAccountModel({
      user: user._id,
      identifier,
      blockchain,
      derivationCounter,
      address,
    });
    await createdSubAccount.save();
    return createdSubAccount;
  }

  private async _getMaxSubAccountDerivationCounter(
    user: UserDocument,
  ): Promise<number> {
    const max = await this._subAccountModel.aggregate([
      {
        $match: { user: user._id },
      },
      {
        $group: {
          _id: null,
          maxDerivationCounter: { $max: '$derivationCounter' },
        },
      },
    ]);
    const currentMax = (max as any)[0]?.maxDerivationCounter || 0;

    return currentMax;
  }
}
