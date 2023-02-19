import { useEffect, useState } from 'react';
import { Cell, Group, useModalRootContext } from '@vkontakte/vkui';
import { MetamaskLogo, WalletConnectLogo } from 'assets';
import { useNotificationsContext } from 'containers/NotificationsContext';
import { useWalletConnectorContext } from 'services';
import { Modals, WalletProviders } from 'types';

import styles from './styles.module.scss';

export const ConnectWallet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentModal } = useNotificationsContext();
  const { updateModalHeight } = useModalRootContext();
  const { connect } = useWalletConnectorContext();
  const handleButtonClick = async (provider: WalletProviders) => {
    setIsLoading(true);
    try {
      await connect(provider);
      setCurrentModal(Modals.init);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(updateModalHeight, [updateModalHeight]);

  return (
    <Group>
      <Cell
        disabled={isLoading}
        onClick={() => handleButtonClick(WalletProviders.metamask)}
        className={styles.connectButtonContainer}
      >
        <MetamaskLogo />
      </Cell>
      <Cell
        disabled={isLoading}
        onClick={() => handleButtonClick(WalletProviders.walletConnect)}
        style={{ justifyContent: 'center' }}
      >
        <WalletConnectLogo />
      </Cell>
    </Group>
  );
};
