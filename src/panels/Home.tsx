import { FC, useEffect, useState } from 'react';
import { Icon24Document } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import {
  Avatar,
  Button,
  Cell,
  File,
  FormItem,
  FormLayout,
  Group,
  Header,
  Input,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Select,
  Textarea,
} from '@vkontakte/vkui';
import { baseApi } from 'api/baseApi';
import { nftLink } from 'appConstants';
import { contractsConfig, ContractsNames } from 'config';
import { useWalletConnectorContext } from 'services';
import { camelize } from 'utils';

import persik from '../img/persik.png';

import styles from './styles.module.css';

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
}

const mintTypeOptions = [
  {
    value: '0',
    label: 'erc721',
  },
  {
    value: '1',
    label: 'erc1155',
  },
];

export const Home: FC<HomeProps> = ({ id }) => {
  const [fetchedUser, setUser] = useState<UserType>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<string>();

  const { walletService, address: userAddress } = useWalletConnectorContext();

  const onChange = (e) => {
    const { name: fieldName, value } = e.currentTarget;
    if (fieldName === 'file') {
      setFile(e.currentTarget.files[0]);
    } else {
      const setStateAction = {
        name: setName,
        description: setDescription,
      }[fieldName];
      setStateAction(value);
    }
  };

  const handleSubmit = async () => {
    try {
      const fileData = new FormData();
      fileData.append('file', file);
      const { data: fileId } = await baseApi.uploadFile(fileData);
      const { data: nftId } = await baseApi.uploadNftMetadata({ name, description, imageFileId: fileId });
      const currentNftLink = nftLink(nftId);
      const { abi, address } = contractsConfig.contracts[ContractsNames.erc721];
      const contract = await new walletService.eth.Contract(abi, address.Polygon);
      await contract.methods.mint(currentNftLink).send({
        from: userAddress,
        value: 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let canceled = false;
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      if (canceled) return;
      setUser(camelize(user) as UserType);
    }
    fetchData();
    return () => {
      canceled = true;
    };
  }, []);
  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack data-to="home" />}>Persik</PanelHeader>
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

      <FormLayout onSubmit={() => console.log('Submit')}>
        <FormItem top="Тип NFT">
          <Select disabled placeholder="Выберите тип" options={mintTypeOptions} />
        </FormItem>
        <FormItem
          top="Название NFT"
          // status={name ? 'valid' : 'error'}
          // bottom={name ? 'Электронная почта введена верно!' : 'Пожалуйста, введите электронную почту'}
        >
          <Input type="name" name="name" value={name} onChange={onChange} />
        </FormItem>
        <FormItem top="Описание">
          <Textarea placeholder="Опишите NFT" name="description" value={description} onChange={onChange} />
        </FormItem>
        <FormItem top="Загрузите изображение">
          <File
            before={<Icon24Document role="presentation" />}
            size="l"
            mode="secondary"
            accept="image/png, image/jpeg"
            name="file"
            onChange={onChange}
          />
        </FormItem>
        <FormItem>
          <Button size="l" stretched onClick={handleSubmit}>
            Mint
          </Button>
        </FormItem>
      </FormLayout>
      <img className={styles.persik} src={persik} alt="Persik The Cat" />
    </Panel>
  );
};
