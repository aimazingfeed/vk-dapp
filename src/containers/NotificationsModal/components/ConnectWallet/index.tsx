import { useEffect, useState } from 'react';
import { Cell, Div, Group, Panel, Spinner, useModalRootContext } from '@vkontakte/vkui';
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
      console.log(err);
    }
    setIsLoading(false);
  };

  // После установки стейта и перерисовки компонента SelectModal сообщим ModalRoot об изменениях
  useEffect(updateModalHeight, [updateModalHeight]);

  return (
    <Div>
      <Panel>
        <Group className={styles.container}>
          <Cell
            className={styles.button}
            disabled={isLoading}
            before={<MetamaskLogo />}
            onClick={() => handleButtonClick(WalletProviders.metamask)}
          />
          <Cell
            className={styles.button}
            disabled={isLoading}
            before={<WalletConnectLogo />}
            onClick={() => handleButtonClick(WalletProviders.walletConnect)}
          />
        </Group>
      </Panel>
    </Div>
  );
};
