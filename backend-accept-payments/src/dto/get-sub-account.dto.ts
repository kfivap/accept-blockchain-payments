import { BlockchainEnum } from '../enums/blockchain.enum';

export class GetSubAccountDto {
  blockchain: BlockchainEnum;
  identifier: string;
}
