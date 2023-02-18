export * from './connect';
export * from './modals';

export type TNullable<T> = T | null;
export type TOptionable<T> = T | undefined;

export enum WalletProviders {
  metamask = 'MetaMask',
  walletConnect = 'WalletConnect',
}
// eslint-disable-next-line no-shadow
export enum RoundingModes {
  up,
  down,
}

export enum Theme {
  dark = 'DARK',
  light = 'LIGHT',
}
