/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chains, IConnectWallet, IContracts } from 'types';
import { toHex } from 'web3-utils';

import { depositAbi, erc721Abi, erc1155Abi } from './abi';
import { isMainnet } from './constants';

export const chains: {
  [key: string]: {
    name: string;
    chainId: number;
    provider: {
      [key: string]: any;
    };
    img?: any;
  };
} = {
  Polygon: {
    name: 'Polygon',
    chainId: isMainnet ? 137 : 80001,
    provider: {
      MetaMask: { name: 'MetaMask' },
      WalletConnect: {
        name: 'WalletConnect',
        useProvider: 'rpc',
        provider: {
          rpc: {
            rpc: {
              [isMainnet ? 137 : toHex(80001)]: isMainnet
                ? 'https://polygon-rpc.com/'
                : 'https://rpc-mumbai.maticvigil.com/',
            },
            chainId: isMainnet ? 137 : toHex(80001),
          },
        },
      },
    },
  },
};

export const connectWallet = (newChainName: Chains): IConnectWallet => {
  const chain = chains[newChainName];
  return {
    network: {
      chainName: chain.name,
      chainID: chain.chainId,
    },
    provider: chain.provider,
    settings: { providerType: true },
  };
};

export enum ContractsNames {
  erc721 = 'erc721',
  erc1155 = 'erc1155',
  deposit = 'deposit',
}

export type IContractsNames = keyof typeof ContractsNames;

// TODO: Add mainnet contracts addresses
export const contractsConfig: IContracts = {
  names: Object.keys(ContractsNames),
  contracts: {
    [ContractsNames.erc721]: {
      address: {
        [Chains.plg]: isMainnet ? '' : '0x89d5177cF90cC375508407d28cAF7cfa49E113bd',
      },
      abi: erc721Abi,
    },
    [ContractsNames.erc1155]: {
      address: {
        [Chains.plg]: isMainnet ? '' : '0x85da5dEbA0E4489ad4E1690246003DE66663790E',
      },
      abi: erc1155Abi,
    },
    [ContractsNames.deposit]: {
      address: {
        [Chains.plg]: isMainnet ? '' : '0x1C33Da6f811FdffB74a969E7b881402D9d10F1D9',
      },
      abi: depositAbi,
    },
  },
};

export const networkDataForAddToMetamask = {
  chainId: isMainnet ? toHex('137') : toHex('80001'),
  nativeCurrency: {
    name: 'Matic',
    symbol: 'Matic',
    decimals: 18,
  },
  chainName: isMainnet ? 'Polygon Mainnet' : 'Mumbai Testnet',
  rpcUrls: isMainnet ? ['https://polygon-rpc.com/'] : ['https://endpoints.omniatech.io/v1/matic/mumbai/public'],
  blockExplorerUrls: [isMainnet ? 'https://polygonscan.com/' : 'https://mumbai.polygonscan.com/'],
};
