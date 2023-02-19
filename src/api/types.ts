export type UserNft = {
  nft: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    tokenId: number;
    contract: {
      blockchain: {
        name: string;
        rpcUrl: string;
        chainId: number;
        erc721FactoryAddress: string;
      };
      address: string;
      type: 'erc721' | 'erc1155';
    };
  };
  amount: number;
  isSystemOwned: boolean;
  address: string;
};

export type NftTransferReceiver = {
  id: number;
  vkId: number;
  photo50: string;
  firstName: string;
  lastName: string;
};

export type MyNftTransfer = {
  id: 0;
  fromUser: NftTransferReceiver;
  toUser: NftTransferReceiver;
  nft: UserNft['nft'];
  timeSent: string;
  timeReceived: string;
  status: 'sent' | 'received';
  depositId: number;
  amount: number;
};
