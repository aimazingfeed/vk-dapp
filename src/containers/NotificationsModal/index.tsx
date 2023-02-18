import { ModalPage, ModalRoot } from '@vkontakte/vkui';
import { useNotificationsContext } from 'containers/NotificationsContext';
import { Modals } from 'types';

import { ConnectWallet } from './components';

const NotificationsModal = () => {
  const { currentModal, setCurrentModal } = useNotificationsContext();
  return (
    <ModalRoot activeModal={currentModal}>
      <ModalPage id={Modals.ConnectWallet} dynamicContentHeight onClose={() => setCurrentModal(Modals.init)}>
        <ConnectWallet />
      </ModalPage>
    </ModalRoot>
  );
};

export { NotificationsModal };
