import { TokenEnum } from 'src/enums/tokens.enum';
import BigNumber from 'bignumber.js';

export type tokenConfigType = {
  [x: string]: tokenConfigRow;
};
export type tokenConfigRow = {
  address: string;
  name: TokenEnum;
  decimals: number;
  minimalWithdraw: string;
};

const tokensConfigRows: tokenConfigRow[] = [
  {
    address: '0xcee15e9f347134dce529df71c8443d71b2022b25',
    name: TokenEnum.USDT_BSC,
    decimals: 18,
    minimalWithdraw: new BigNumber('10').shiftedBy(18).toString(),
  },
];

export const tokensConfigByAddress: tokenConfigType = {};
for (const data of tokensConfigRows) {
  tokensConfigByAddress[data.address] = data;
}

export const tokensConfigByName: tokenConfigType = {
  [TokenEnum.NATIVE_BNB]: {
    address: null,
    name: TokenEnum.USDT_BSC,
    decimals: 18,
    minimalWithdraw: new BigNumber('0.01').shiftedBy(18).toString(),
  },
};
for (const data of tokensConfigRows) {
  tokensConfigRows[data.name] = data;
}
