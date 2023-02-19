import { FC } from 'react';
import { Button, Div, Group, Panel, PanelHeader } from '@vkontakte/vkui';
import { useNotificationsContext } from 'containers';
import { Modals } from 'types';

interface AuthorizationProps {
  id: string;
}

export const Authorization: FC<AuthorizationProps> = ({ id }) => {
  const { setCurrentModal } = useNotificationsContext();
  const handleButtonClick = () => {
    setCurrentModal(Modals.ConnectWallet);
  };

  return (
    <Panel id={id}>
      <PanelHeader>Authorization</PanelHeader>
      <Group>
        <Div>Для авторизации, пожалуйста, подключите ваш кошелек:</Div>
        <Button stretched size="l" mode="secondary" onClick={handleButtonClick}>
          Подключить
        </Button>
      </Group>
    </Panel>
  );
};
