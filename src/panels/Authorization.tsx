import { FC } from 'react';
import { Button, Div, Group, Header, Panel, PanelHeader } from '@vkontakte/vkui';
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
      <Group header={<Header mode="secondary">Navigation Example</Header>}>
        <Div>Please, connect you crypto wallet</Div>
        <Button stretched size="l" mode="secondary" onClick={handleButtonClick}>
          Connect
        </Button>
      </Group>
    </Panel>
  );
};
