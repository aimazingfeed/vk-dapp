import { Dispatch, FC, ReactNode, SetStateAction, useEffect } from 'react';
import { useWalletConnectorContext } from 'services';

export interface LayoutProps {
  children?: ReactNode;
  setActivePanel: Dispatch<SetStateAction<string>>;
}

export const Layout: FC<LayoutProps> = ({ children, setActivePanel }) => {
  const { address, isVerified } = useWalletConnectorContext();

  useEffect(() => {
    if (!isVerified) {
      setActivePanel('authorization');
    }
    if (isVerified && address) {
      setActivePanel('home');
    }
  }, [address, isVerified, setActivePanel]);

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};
