import { TokenEnum } from 'src/enums/tokens.enum';

export type tokenConfigType = {
  [x: string]: tokenConfigRow;
};
export type tokenConfigRow = { name: TokenEnum };

export const tokensConfig: tokenConfigType = {
  ['0xcee15e9f347134dce529df71c8443d71b2022b25'.toLocaleLowerCase()]: {
    name: TokenEnum.USDT_BSC,
  },
};
