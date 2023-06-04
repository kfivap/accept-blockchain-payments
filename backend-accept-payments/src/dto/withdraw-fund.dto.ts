import { BlockchainEnum } from 'src/enums/blockchain.enum';
import { TokenEnum } from 'src/enums/tokens.enum';

export class WithdrawDto {
  blockchain: BlockchainEnum;
  token: TokenEnum;
  amount: string;
  destination: string;
}
