import qs from 'querystring';

import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  Avatar,
  Button,
  ButtonGroup,
  Group,
  Header,
  HorizontalCell,
  HorizontalScroll,
  Image,
  Panel,
  RichCell,
  Title,
} from '@vkontakte/vkui';
import { baseApi } from 'api/baseApi';
import { MyNftTransfer, UserNft } from 'api/types';
import { contractsConfig, ContractsNames } from 'config';
import { useNotificationsContext } from 'containers';
import { format } from 'date-fns';
import { isEqual } from 'lodash';
import { useWalletConnectorContext } from 'services';
import { Modals } from 'types';
import { camelize, snakeize } from 'utils';

import styles from './styles.module.scss';

interface UserType {
  photo200: string;
  firstName: string;
  lastName: string;
  city: {
    title: string;
  };
}

interface HomeProps {
  id: string;
  setActivePanel: Dispatch<SetStateAction<string>>;
  setIsCommonLoader: Dispatch<SetStateAction<boolean>>;
}

export const Home: FC<HomeProps> = ({ id, setActivePanel, setIsCommonLoader }) => {
  const { setCurrentModalData, setCurrentModal } = useNotificationsContext();
  const { walletService, address: userAddress } = useWalletConnectorContext();

  const [user, setUser] = useState<UserType>();
  const [userNft, setUserNft] = useState<UserNft[]>([]);
  const [myNftTransfers, setMyNftTransfers] = useState<MyNftTransfer[]>([]);
  const [authToken, setAuthToken] = useState('');

  const userQueryParams = camelize(qs.parse(window.location.search.slice(1))) as any;
  const myId: string = userQueryParams.vkUserId;

  const isAcceptable = useCallback(
    (status: 'sent' | 'received', receiverId: number) => {
      if (status === 'sent' && receiverId === +myId) return true;
      return false;
    },
    [myId],
  );

  const getStatusInfo = useCallback(
    (status: 'sent' | 'received', receiverId: number): { color: string; title: string } => {
      if (status === 'received' && receiverId === +myId) return { color: '#5ED471', title: 'Получено' };
      if (status === 'sent' && receiverId === +myId) return { color: '#FF9933', title: 'Ожидает получения' };
      return { color: '#F72929', title: 'Отправлено' };
    },
    [myId],
  );

  const handleClickMintNft = () => {
    setActivePanel('mint-nft');
  };

  const handleNftClick = useCallback(
    (idx: number) => {
      setCurrentModalData(userNft[idx]);
      setCurrentModal(Modals.Nft);
    },
    [setCurrentModal, setCurrentModalData, userNft],
  );

  const handleClaim = async (nftTransferId: string, depositId: string) => {
    try {
      setIsCommonLoader(true);
      const { data: signature } = await baseApi.getClaimSignature({ nftTransferId });
      const { abi, address } = contractsConfig.contracts[ContractsNames.deposit];
      const contract = await new walletService.eth.Contract(abi, address.Polygon);
      await contract.methods.claimDeposit(depositId, signature).send({
        from: userAddress,
        value: 0,
      });
    } catch (err) {
      console.error(err);
    }
    setIsCommonLoader(false);
  };

  const getUserData = useCallback(async (requestedUserId: string, token: string) => {
    try {
      if (!token) return {};
      const fetchedUserData = camelize(
        await bridge.send('VKWebAppCallAPIMethod', {
          method: 'users.get',
          params: {
            user_ids: requestedUserId,
            fields: 'photo_50',
            v: '5.131',
            access_token: token,
          },
        }),
      ) as any;
      return fetchedUserData;
    } catch (err) {
      console.error(err);
      return {};
    }
  }, []);

  useEffect(() => {
    let canceled = false;
    (async () => {
      if (!userQueryParams.vkAppId) return;
      setIsCommonLoader(true);
      const fetchedUser = await bridge.send('VKWebAppGetUserInfo');
      const fetchedAuthToken = camelize(
        await bridge.send(
          'VKWebAppGetAuthToken',
          snakeize({
            appId: +userQueryParams.vkAppId,
            scope: '',
          }) as any,
        ),
      ) as any;
      const { data: fetchedUserNft } = await baseApi.getUserNft();
      const { data: fetchedMyNftTransfers } = await baseApi.myNftTransfers();
      const idsSet = new Set();
      fetchedMyNftTransfers.forEach((transfer) => {
        idsSet.add(transfer.fromUser.vkId);
        idsSet.add(transfer.toUser.vkId);
      });
      const ids = Array.from(idsSet).join(', ');

      const advancedFields = await getUserData(ids, fetchedAuthToken.accessToken);
      const fetchedMyNftTransfersAdvanced = fetchedMyNftTransfers.map((item) => ({
        ...item,
        fromUser: {
          ...item.fromUser,
          photo50: advancedFields.response?.find((el) => el.id === item.fromUser.vkId).photo50,
          firstName: advancedFields.response?.find((el) => el.id === item.fromUser.vkId).firstName,
          lastName: advancedFields.response?.find((el) => el.id === item.fromUser.vkId).lastName,
        },
        toUser: {
          ...item.toUser,
          photo50: advancedFields.response?.find((el) => el.id === item.toUser.vkId).photo50,
          firstName: advancedFields.response?.find((el) => el.id === item.toUser.vkId).firstName,
          lastName: advancedFields.response?.find((el) => el.id === item.toUser.vkId).lastName,
        },
      }));
      if (canceled) return;
      setUser(camelize(fetchedUser) as UserType);
      setAuthToken((camelize(fetchedAuthToken) as any).accessToken);
      setUserNft(fetchedUserNft);
      setMyNftTransfers(fetchedMyNftTransfersAdvanced);
      setIsCommonLoader(false);
    })();
    return () => {
      canceled = true;
    };
  }, [getUserData, myId, setIsCommonLoader, userQueryParams.vkAppId]);

  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        const { data: fetchedUserNft } = await baseApi.getUserNft();
        const { data: fetchedMyNftTransfers } = await baseApi.myNftTransfers();
        const idsSet = new Set();
        fetchedMyNftTransfers.forEach((transfer) => {
          idsSet.add(transfer.fromUser.vkId);
          idsSet.add(transfer.toUser.vkId);
        });
        const ids = Array.from(idsSet).join(', ');

        const advancedFields = await getUserData(ids, authToken);
        const fetchedMyNftTransfersAdvanced = fetchedMyNftTransfers.map((item) => ({
          ...item,
          fromUser: {
            ...item.fromUser,
            photo50: advancedFields.response?.find((el) => el.id === item.fromUser.vkId).photo50,
            firstName: advancedFields.response?.find((el) => el.id === item.fromUser.vkId).firstName,
            lastName: advancedFields.response?.find((el) => el.id === item.fromUser.vkId).lastName,
          },
          toUser: {
            ...item.toUser,
            photo50: advancedFields.response?.find((el) => el.id === item.toUser.vkId).photo50,
            firstName: advancedFields.response?.find((el) => el.id === item.toUser.vkId).firstName,
            lastName: advancedFields.response?.find((el) => el.id === item.toUser.vkId).lastName,
          },
        }));
        if (!isEqual(fetchedUserNft, userNft)) {
          setUserNft(fetchedUserNft);
        }
        if (!isEqual(fetchedMyNftTransfersAdvanced, myNftTransfers)) {
          setMyNftTransfers(fetchedMyNftTransfersAdvanced);
        }
      })();
    }, 5000);

    return () => clearInterval(interval);
  }, [authToken, getUserData, myNftTransfers, userNft]);

  return (
    <Panel id={id}>
      <Group className={styles.myNft} header={<Header>Мои NFT</Header>}>
        <HorizontalScroll>
          <div style={{ display: 'flex' }}>
            {userNft &&
              userNft.map(({ nft: { name, description, imageUrl, id: keyId } }, idx) => (
                <HorizontalCell
                  onClick={() => handleNftClick(idx)}
                  key={keyId}
                  size="l"
                  header={name}
                  subtitle={description}
                >
                  <Image size={128} src={imageUrl} />
                </HorizontalCell>
              ))}
            {userNft?.length === 0 && <Title>No items yet</Title>}
          </div>
        </HorizontalScroll>
      </Group>
      <Group header={<Header>История</Header>}>
        {myNftTransfers &&
          myNftTransfers.map(
            ({
              id: transferId,
              status,
              timeSent,
              timeReceived,
              toUser,
              fromUser,
              amount,
              nft: { name, imageUrl, contract },
              depositId,
            }) => (
              <RichCell
                before={<Avatar size={48} src={fromUser.vkId === +myId ? toUser.photo50 : fromUser.photo50} />}
                caption={format(
                  new Date(fromUser.vkId === +myId ? timeSent : timeReceived || timeSent),
                  'dd.MM.yyyy в HH:mm',
                )}
                key={transferId}
                after={
                  <div style={{ display: 'flex' }}>
                    <p style={{ marginRight: 8 }}>
                      <span style={{ color: getStatusInfo(status, toUser.vkId).color }}>
                        {getStatusInfo(status, toUser.vkId).title}
                      </span>
                      {` ${contract.type === 'erc1155' ? `${amount} ` : ''}${name}`}
                    </p>
                    <Image size={48} src={imageUrl} style={{ objectFit: 'contain' }} />
                  </div>
                }
                actions={
                  isAcceptable(status, toUser.vkId) && (
                    <ButtonGroup mode="horizontal" gap="s" stretched>
                      <Button
                        mode="primary"
                        size="s"
                        onClick={() => handleClaim(String(transferId), String(depositId))}
                      >
                        Принять
                      </Button>
                    </ButtonGroup>
                  )
                }
                multiline
                disabled
              >
                {(status === 'received' && toUser.vkId === +myId) || (status === 'sent' && toUser.vkId === +myId)
                  ? `${fromUser.firstName} ${fromUser.lastName}`
                  : `${toUser.firstName} ${toUser.lastName}`}
              </RichCell>
            ),
          )}
      </Group>
    </Panel>
  );
};
