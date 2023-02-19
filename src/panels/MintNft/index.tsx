import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Icon24Document } from '@vkontakte/icons';
import { Button, File, FormItem, FormLayout, Input, Panel, Select, Textarea } from '@vkontakte/vkui';
import { baseApi } from 'api/baseApi';
import { nftLink } from 'appConstants';
import { contractsConfig, ContractsNames } from 'config';
import { useWalletConnectorContext } from 'services';

import styles from './styles.module.scss';

interface HomeProps {
  id: string;
  setActivePanel: Dispatch<SetStateAction<string>>;
  setIsCommonLoader: Dispatch<SetStateAction<boolean>>;
}

interface ValidationModel {
  name: boolean;
  amount: boolean;
  description: boolean;
  file: boolean;
}

const mintTypeOptions = [
  {
    value: '0',
    label: 'ERC-721 (Единичный)',
  },
  {
    value: '1',
    label: 'ERC-1155 (Множественный)',
  },
];

const initErrors = {
  name: false,
  amount: false,
  description: false,
  file: false,
};

export const MintNft: FC<HomeProps> = ({ id, setActivePanel, setIsCommonLoader }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [file, setFile] = useState<File>(null);
  const [currentMintType, setCurrentMintType] = useState(mintTypeOptions[0].value);
  const [errors, setErrors] = useState<ValidationModel>(initErrors);

  const { walletService, address: userAddress } = useWalletConnectorContext();

  const isErc1155 = currentMintType === '1';

  const onChange = (e) => {
    const { name: fieldName, value } = e.currentTarget;
    if (fieldName === 'file') {
      setFile(e.currentTarget.files[0]);
      setErrors((prev) => ({ ...prev, [fieldName]: false }));
    } else {
      const setStateAction = {
        name: setName,
        description: setDescription,
        amount: setAmount,
      }[fieldName];
      if (!value) setErrors((prev) => ({ ...prev, [fieldName]: true }));
      else setErrors((prev) => ({ ...prev, [fieldName]: false }));
      setStateAction(value);
    }
  };
  const handleReturnToHomeClick = () => {
    setActivePanel('home');
  };
  const handleSubmit = async () => {
    if (!file) setErrors((prev) => ({ ...prev, file: true }));
    if (!name) setErrors((prev) => ({ ...prev, name: true }));
    if (!description) setErrors((prev) => ({ ...prev, description: true }));
    if (isErc1155 && !amount) setErrors((prev) => ({ ...prev, amount: true }));
    if (!file || !name || !description || (isErc1155 && !amount)) return;
    try {
      setIsCommonLoader(true);
      const fileData = new FormData();
      fileData.append('file', file);
      const { data: fileId } = await baseApi.uploadFile(fileData);
      const { data: nftId } = await baseApi.uploadNftMetadata({ name, description, imageFileId: fileId });
      const currentNftLink = nftLink(nftId);
      const { abi, address } = contractsConfig.contracts[isErc1155 ? ContractsNames.erc1155 : ContractsNames.erc721];
      const contract = await new walletService.eth.Contract(abi, address.Polygon);
      const args = isErc1155 ? [amount, currentNftLink] : [currentNftLink];
      await contract.methods.mint(...args).send({
        from: userAddress,
        value: 0,
      });
      handleReturnToHomeClick();
    } catch (err) {
      console.error(err);
    }
    setIsCommonLoader(false);
  };
  return (
    <Panel id={id}>
      <FormLayout>
        <FormItem top="Тип NFT">
          <Select
            value={currentMintType}
            defaultValue={mintTypeOptions[0].value}
            placeholder="Выберите тип"
            onChange={(e) => setCurrentMintType(e.target.value)}
            options={mintTypeOptions}
          />
        </FormItem>
        {isErc1155 && (
          <FormItem top="Количество NFT" status={errors.amount ? 'error' : 'default'}>
            <Input
              type="amount"
              name="amount"
              placeholder="Введите число выпускаемых NFT"
              value={amount}
              onChange={onChange}
            />
          </FormItem>
        )}
        <FormItem top="Название NFT" status={errors.name ? 'error' : 'default'}>
          <Input type="name" name="name" placeholder="Назовите NFT" value={name} onChange={onChange} />
        </FormItem>
        <FormItem top="Описание" status={errors.description ? 'error' : 'default'}>
          <Textarea placeholder="Опишите NFT" name="description" value={description} onChange={onChange} />
        </FormItem>
        <FormItem top="Загрузите изображение" status={errors.file ? 'error' : 'default'}>
          <File
            before={<Icon24Document role="presentation" />}
            size="l"
            mode="secondary"
            accept="image/png, image/jpeg"
            name="file"
            onChange={onChange}
            style={errors.file ? { background: 'rgba(255, 0, 0, 0.3)' } : null}
          >
            {file?.name || 'Файл для NFT'}
          </File>
        </FormItem>
        <FormItem>
          <Button size="m" stretched onClick={handleSubmit} className={styles.button}>
            Создать
          </Button>
        </FormItem>
      </FormLayout>
    </Panel>
  );
};
