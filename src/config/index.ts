/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chains, IConnectWallet, IContracts } from 'types';

import { factoryAbi } from './abi';
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
              [isMainnet ? 137 : 80001]: isMainnet ? 'https://polygon-rpc.com/' : 'https://rpc-mumbai.maticvigil.com/',
            },
            chainId: isMainnet ? 137 : 80001,
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
  staking = 'staking',
  factory = 'factory',
}

export type IContractsNames = keyof typeof ContractsNames;

// TODO: Add mainnet contracts addresses
export const contractsConfig: IContracts = {
  names: Object.keys(ContractsNames),
  decimals: 18,
  contracts: {
    [ContractsNames.factory]: {
      address: {
        [Chains.plg]: isMainnet ? '' : '0x6333bAD1632ae2a78CfC4aD4AEc6C99B1b54CdBD',
      },
      abi: factoryAbi,
    },
  },
};

export const networkDataForAddToMetamask = {
  chainID: isMainnet ? 137 : 80001,
  chainName: isMainnet ? 'Polygon Mainnet' : 'Mumbai Testnet',
  rpcUrls: isMainnet ? 'https://polygon-rpc.com/' : 'https://rpc-mumbai.maticvigil.com/',
  blockExplorerUrls: [isMainnet ? 'https://polygonscan.com/' : 'https://mumbai.polygonscan.com/'],
};
