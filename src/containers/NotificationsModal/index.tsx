import { Dispatch, FC, SetStateAction } from 'react';
import { ModalPage, ModalRoot } from '@vkontakte/vkui';
import { useNotificationsContext } from 'containers/NotificationsContext';
import { Modals } from 'types';

import { ConnectWallet, Nft } from './components';

interface NotificationsModalProps {
  setIsCommonLoader: Dispatch<SetStateAction<boolean>>;
}

const NotificationsModal: FC<NotificationsModalProps> = ({ setIsCommonLoader }) => {
  const { currentModal, setCurrentModal } = useNotificationsContext();
  return (
    <ModalRoot activeModal={currentModal}>
      <ModalPage id={Modals.ConnectWallet} dynamicContentHeight onClose={() => setCurrentModal(Modals.init)}>
        <ConnectWallet />
      </ModalPage>
      <ModalPage id={Modals.Nft} dynamicContentHeight onClose={() => setCurrentModal(Modals.init)}>
        <Nft setIsCommonLoader={setIsCommonLoader} />
      </ModalPage>
    </ModalRoot>
  );
};

export { NotificationsModal };
