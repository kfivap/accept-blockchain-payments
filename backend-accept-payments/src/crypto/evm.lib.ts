import { ethers } from 'ethers';

export function generateEthAddress(
  seedPhrase: string,
  derivationIndex: number,
): string {
  const derivationPath = `m/44'/60'/0'/0/${derivationIndex}`;
  const hdNode = ethers.utils.HDNode.fromMnemonic(seedPhrase);

  return hdNode.derivePath(derivationPath).address;
}
