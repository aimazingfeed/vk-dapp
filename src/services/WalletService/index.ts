/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectWallet } from '@amfi/connect-wallet';
import { IConnect, IError } from '@amfi/connect-wallet/dist/interface';
import { connectWallet as connectWalletConfig } from 'config';
import { Chains, WalletProviders } from 'types';

export class WalletService {
  public connectWallet: ConnectWallet;

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public async initWalletConnect(providerName: WalletProviders, chainName: Chains): Promise<boolean | unknown> {
    const { provider, network, settings } = connectWalletConfig(chainName);

    try {
      const connecting = await this.connectWallet.connect(provider[providerName], network, settings);

      return connecting;
    } catch (error) {
      console.error('initWalletConnect providerWallet err: ', error);
      return false;
    }
  }

  public resetConnect(): void {
    this.connectWallet.resetConect();
  }

  public eventSubscribe() {
    return this.connectWallet.eventSubscriber();
  }

  public Web3() {
    return this.connectWallet.currentWeb3();
  }

  public getAccount(): Promise<IConnect | IError | { address: string }> {
    return this.connectWallet.getAccounts();
  }

  sendTransaction(transactionConfig: any, walletAddress: string) {
    return this.Web3().eth.sendTransaction({
      ...transactionConfig,
      from: walletAddress,
    });
  }
}
