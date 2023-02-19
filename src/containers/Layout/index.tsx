import { Dispatch, FC, ReactNode, SetStateAction, useEffect } from 'react';
import { PanelHeader, SegmentedControl } from '@vkontakte/vkui';
import { useWalletConnectorContext } from 'services';
import { WalletProviders } from 'types';

export interface LayoutProps {
  children?: ReactNode;
  setActivePanel: Dispatch<SetStateAction<string>>;
}

export const Layout: FC<LayoutProps> = ({ children, setActivePanel }) => {
  const { address, isVerified, connect } = useWalletConnectorContext();

  useEffect(() => {
    if (!isVerified) {
      setActivePanel('authorization');
    }
    if (isVerified && address) {
      setActivePanel('home');
    }
  }, [address, isVerified, setActivePanel]);

  useEffect(() => {
    connect(WalletProviders.metamask);
  }, [connect]);

  return (
    <div style={{ padding: '0 14px' }}>
      <PanelHeader>QM NFT</PanelHeader>
      <SegmentedControl
        onChange={(value) => setActivePanel(String(value))}
        size="m"
        style={{ marginTop: '14px' }}
        options={[
          {
            label: 'Мои NFT',
            value: 'home',
          },
          {
            label: 'Создать NFT',
            value: 'mint-nft',
          },
        ]}
      />
      <main>{children}</main>
    </div>
  );
};
