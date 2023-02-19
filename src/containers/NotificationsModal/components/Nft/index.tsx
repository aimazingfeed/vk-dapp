import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Button, FormItem, FormLayout, Group, Input, Textarea, Title, useModalRootContext } from '@vkontakte/vkui';
import { baseApi } from 'api/baseApi';
import { UserNft } from 'api/types';
import { contractsConfig, ContractsNames } from 'config';
import { useNotificationsContext } from 'containers/NotificationsContext';
import { useWalletConnectorContext } from 'services';
import { Chains, Modals } from 'types';
import { camelize } from 'utils';

import styles from './styles.module.scss';

interface UserFriend {
  users: {
    id: number;
    firstName: string;
    lastName: string;
    sex: 0 | 1 | 2;
    photo200: string;
  }[];
}

interface NftProps {
  setIsCommonLoader: Dispatch<SetStateAction<boolean>>;
}

export const Nft: FC<NftProps> = ({ setIsCommonLoader }) => {
  const { currentModalData, setCurrentModal } = useNotificationsContext();
  const { updateModalHeight } = useModalRootContext();
  const { walletService, address: userAddress } = useWalletConnectorContext();

  const [isLoading, setIsLoading] = useState(false);
  const [nftSendAmount, setNftSendAmount] = useState('');

  const nftData = useMemo(() => currentModalData as UserNft, [currentModalData]);
  const currentNftType = nftData.nft.contract.type === 'erc721' ? 'ERC-721' : 'ERC-1155';
  const isErc1155 = nftData.nft.contract.type === 'erc1155';
  const handleSendClick = async () => {
    setIsLoading(true);
    setIsCommonLoader(true);
    try {
      const fetchedFriend = camelize(await bridge.send('VKWebAppGetFriends')) as UserFriend;
      const requestedUserId = fetchedFriend.users?.[0]?.id;
      const requestedNftBackendId = nftData.nft.id;
      const requestedNftBlockchainId = nftData.nft.tokenId;
      const { data: requestedUserWallet } = await baseApi.getUserAddress({ vkUserId: String(requestedUserId) });
      const {
        address: { [Chains.plg]: factoryContractAddress },
        abi: factoryAbi,
      } = contractsConfig.contracts[isErc1155 ? ContractsNames.erc1155 : ContractsNames.erc721];
      const factoryContract = await new walletService.eth.Contract(factoryAbi, factoryContractAddress);
      if (!requestedUserWallet) {
        const {
          address: { [Chains.plg]: depositContractAddress },
          abi: depositAbi,
        } = contractsConfig.contracts[ContractsNames.deposit];

        const { data: nonce } = await baseApi.createNftTransfer({
          toVkUserId: requestedUserId,
          nftId: requestedNftBackendId,
        });
        const depositContract = await new walletService.eth.Contract(depositAbi, depositContractAddress);
        const approveArgs = isErc1155
          ? [depositContractAddress, true]
          : [depositContractAddress, requestedNftBlockchainId];
        await factoryContract.methods[isErc1155 ? 'setApprovalForAll' : 'approve'](...approveArgs).send({
          from: userAddress,
          value: 0,
        });
        await depositContract.methods
          .depositToken([nftData.nft.contract.address, requestedNftBlockchainId, isErc1155 ? nftSendAmount : 0], nonce)
          .send({
            from: userAddress,
            value: 0,
          });
      } else {
        const args = isErc1155
          ? [userAddress, requestedUserWallet, requestedNftBlockchainId, nftSendAmount, '0x']
          : [userAddress, requestedUserWallet, requestedNftBlockchainId];
        await factoryContract.methods.safeTransferFrom(...args).send({
          from: userAddress,
          value: 0,
        });
      }
    } catch (err) {
      console.error(err);
    }
    setCurrentModal(Modals.init);
    setIsLoading(false);
    setIsCommonLoader(false);
  };

  useEffect(() => {
    setNftSendAmount(String(nftData.amount));
  }, [nftData.amount]);
  // После установки стейта и перерисовки компонента SelectModal сообщим ModalRoot об изменениях
  useEffect(updateModalHeight, [updateModalHeight]);

  return (
    nftData && (
      <Group className={styles.container}>
        <img className={styles.nftImg} alt={nftData.nft.name} src={nftData.nft.imageUrl} width={300} />
        <Title level="2" className={styles.text}>
          {nftData.nft.name} <span style={{ opacity: 0.5 }}>({currentNftType})</span>
        </Title>
        <Title level="3" weight="3" className={styles.text}>
          Описание: {nftData.nft.description}
        </Title>
        {isErc1155 && (
          <FormLayout>
            <Title level="3" weight="3" className={styles.text}>
              Количество: {nftData.amount}
            </Title>
            <FormItem
              top="Отправить:"
              status={+nftSendAmount > +nftData.amount || !nftSendAmount ? 'error' : 'default'}
            >
              <Input
                type="text"
                name="amount"
                placeholder="Введите число отправляемых NFT"
                value={nftSendAmount}
                onChange={({ currentTarget }) => setNftSendAmount(currentTarget.value)}
              />
            </FormItem>
          </FormLayout>
        )}
        <Button disabled={isLoading} onClick={handleSendClick}>
          Отправить
        </Button>
      </Group>
    )
  );
};
