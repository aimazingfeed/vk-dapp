/* eslint-disable @typescript-eslint/no-explicit-any */
import { INetwork, IProvider, ISettings } from '@amfi/connect-wallet/dist/interface';

export enum ChainsEnum {
  'Polygon' = 'Polygon',
}

export enum Chains {
  plg = 'Polygon',
}
export type IChainType = 'testnet' | 'mainnet';

export interface IConnectWallet {
  network: INetwork;
  provider: {
    [index: string]: IProvider;
  };
  settings: ISettings;
}
export interface IChainConfig {
  name: string;
  id: number;
  rpc: string;
  tx: {
    link: string;
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExp: string;
}

export interface IContracts {
  decimals: number;
  names: string[];
  contracts: {
    [index: string]: {
      address?: {
        [key in Chains]: string;
      };
      abi: any[];
    };
  };
}
