import { AxiosResponse } from 'axios';
import { camelize, snakeize } from 'utils';

import client from './axios';
import { MyNftTransfer, UserNft } from './types';

export const baseApi = {
  getNonce: (params: { address }): Promise<AxiosResponse<string>> => client.get('get_address_nonce', { params }),
  setAddressNonce: (params: { address; signature }): Promise<AxiosResponse<string>> =>
    client.get('bind_address', { params }),
  getAddresses: (): Promise<AxiosResponse<string[]>> => client.get('my_addresses'),
  uploadFile: (data: FormData): Promise<AxiosResponse<string>> =>
    client.post('upload_file', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  uploadNftMetadata: (data: {
    name: string;
    description: string;
    imageFileId: string;
  }): Promise<AxiosResponse<string>> => client.post('create_nft_metadata', snakeize(data)),
  getUserNft: (): Promise<AxiosResponse<UserNft[]>> =>
    client.get('my_nfts', {
      headers: { Accept: 'application/json' },
      transformResponse: (response) => camelize(JSON.parse(response)),
    }),
  getUserAddress: (params: { vkUserId: string }): Promise<AxiosResponse<string>> =>
    client.get('get_user_address', { params: snakeize(params) }),
  createNftTransfer: (data: { toVkUserId: number; nftId: number }): Promise<AxiosResponse<string>> =>
    client.post('create_nft_transfer', snakeize(data)),
  myNftTransfers: (): Promise<AxiosResponse<MyNftTransfer[]>> =>
    client.get('my_nft_transfers', { transformResponse: (response) => camelize(JSON.parse(response)) }),
  getClaimSignature: (params: { nftTransferId: string }): Promise<AxiosResponse<string>> =>
    client.get('get_claim_signature', { params: snakeize(params) }),
};
