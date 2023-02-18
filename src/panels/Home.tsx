import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Avatar, Button, Cell, Div, Group, Header, Panel, PanelHeader } from '@vkontakte/vkui';
import { baseApi } from 'api/baseApi';
import { useWalletConnectorContext } from 'services';
import { WalletProviders } from 'types';

interface HomeProps {
  id: string;
  fetchedUser: {
    photo200: string;
    firstName: string;
    lastName: string;
    city: {
      title: string;
    };
  };
}

const Home: FC<HomeProps> = ({ id, fetchedUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { connect, address: userAddress, setAddress, setIsVerified, isVerified } = useWalletConnectorContext();
  const handleButtonClick = async () => {
    setIsLoading(true);
    try {
      await connect(WalletProviders.metamask);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let canceled = false;
    (async () => {
      const { data: addresses } = await baseApi.getAddresses();
      if (canceled || !addresses.length) return;
      console.log(addresses);
      setAddress(addresses[0]);
      // setIsVerified(true);
    })();
    return () => {
      canceled = true;
    };
  }, [setAddress, setIsVerified]);
  return (
    <Panel id={id}>
      <PanelHeader>Example</PanelHeader>
      {fetchedUser && (
        <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
          <Cell
            before={fetchedUser.photo200 ? <Avatar src={fetchedUser.photo200} /> : null}
            subtitle={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
          >
            {`${fetchedUser.firstName} ${fetchedUser.lastName}`}
          </Cell>
        </Group>
      )}

      <Group header={<Header mode="secondary">Navigation Example</Header>}>
        <Div>
          {isVerified ? (
            <Div>Account {userAddress} connected</Div>
          ) : (
            <Button disabled={isLoading} stretched size="l" mode="secondary" onClick={handleButtonClick}>
              Connect
            </Button>
          )}
        </Div>
      </Group>
    </Panel>
  );
};

export default Home;
