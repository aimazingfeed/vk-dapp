/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { baseApi } from 'api/baseApi';
import { chains, networkDataForAddToMetamask } from 'config';
import { Subscription } from 'rxjs';
import { Chains, WalletProviders } from 'types';
import { shortenPhrase } from 'utils';
import Web3 from 'web3';
import { provider as web3Provider } from 'web3-core';
import { toChecksumAddress } from 'web3-utils';

import { WalletService } from '../WalletService';

interface IContextValue {
  connect: (provider: WalletProviders) => Promise<[string, Web3]>;
  disconnect: () => void;
  isVerified: boolean;
  setIsVerified: Dispatch<SetStateAction<boolean>>;
  walletService: Web3;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
}

interface WalletConnectContextProps {
  children: ReactNode;
}

const Web3Context = createContext({} as IContextValue);

const WalletConnectContext: FC<WalletConnectContextProps> = ({ children }) => {
  const [currentSubscriber, setCurrentSubscriber] = useState<Subscription>();
  const WalletConnect = useMemo(() => new WalletService(), []);
  const [address, setAddress] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const disconnect = useCallback(() => {
    WalletConnect.resetConnect();
    currentSubscriber?.unsubscribe();
    setCurrentSubscriber(null);
    localStorage.removeItem('walletconnect');
  }, [WalletConnect, currentSubscriber]);

  const subscriberSuccess = useCallback(
    (data: any) => {
      if (document.visibilityState !== 'visible') {
        disconnect();
      }

      // On MetaMask Accounts => Change / Disconnect / Connect
      if (data.name === 'accountsChanged') {
        disconnect();
      }
    },
    [disconnect],
  );

  const subscriberError = useCallback(
    (err: any) => {
      console.error(err);
      if (err.code === 4) {
        toast.error('You changed to wrong network. Please choose Binance Smart Chain');
        disconnect();
      }
    },
    [disconnect],
  );

  const connect = useCallback(
    async (provider: WalletProviders) => {
      const chain = Chains.plg;
      let userAddress: string;
      try {
        const { data: addresses } = await baseApi.getAddresses();
        const connected = await WalletConnect.initWalletConnect(provider, chain);
        if (addresses?.length) {
          [userAddress] = addresses;
        }
        if (connected) {
          try {
            const accountInfo: any = await WalletConnect.getAccount();
            if (accountInfo.network.chainID !== chains[chain].chainId) {
              localStorage.removeItem('walletconnect');
              throw new Error('Unexpected error');
            }
            if (accountInfo.address) {
              if (userAddress && toChecksumAddress(userAddress) === toChecksumAddress(accountInfo.address)) {
                setIsVerified(true);
                setAddress(userAddress);
                return [userAddress, WalletConnect.Web3()] as [string, Web3];
              }
              if (!userAddress) {
                const { data: message } = await baseApi.getNonce({ address: accountInfo.address });
                const signature = await WalletConnect.Web3().eth.personal.sign(message, accountInfo.address, '');
                const isSuccess = await baseApi.setAddressNonce({ address: accountInfo.address, signature });
                if (isSuccess) {
                  setIsVerified(true);
                  setAddress(accountInfo.address);
                  userAddress = accountInfo.address;
                  return [accountInfo.address, WalletConnect.Web3()] as [string, Web3];
                }
              } else {
                throw new Error(`Please connect wallet with address ${userAddress}`);
              }
            }
            if (!currentSubscriber) {
              const sub = WalletConnect.eventSubscribe().subscribe(subscriberSuccess, subscriberError);
              // @ts-ignore
              setCurrentSubscriber(sub);
            }
          } catch (error) {
            console.error(error);
            toast.error(error.message.text);

            // @ts-ignore
            if (!window.ethereum) {
              window.open(
                `https://metamask.app.link/dapp/${window.location.hostname + window.location.pathname}/?utm_source=mm`,
              );
              throw new Error('Metamask is not installed');
            }
            // HOTFIX FOR OUR LIB, CHANGE LIB TYPES LATER
            if (error.code === 4) {
              // @ts-ignore
              window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [networkDataForAddToMetamask],
              });
              throw new Error('Metamask is not installed');
            }
            // throw error; - // When decline wallet connect modal - throwing error
          }
        }
        throw new Error('Something went wrong');
      } catch (err) {
        toast.error(err);
      }
      return [userAddress, WalletConnect.Web3()] as [string, Web3];
    },
    [WalletConnect, currentSubscriber, subscriberError, subscriberSuccess],
  );
  const web3WithoutMetamask = () => {
    const [first] = Object.values(chains.Polygon.provider.WalletConnect.provider.rpc.rpc);
    return new Web3(first as web3Provider);
  };

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        isVerified,
        setIsVerified,
        walletService: WalletConnect.Web3() || web3WithoutMetamask(),
        address,
        setAddress,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

const useWalletConnectorContext = () => useContext(Web3Context);

export { WalletConnectContext, useWalletConnectorContext };
