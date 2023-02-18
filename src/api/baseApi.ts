import { AxiosResponse } from 'axios';
import { snakeize } from 'utils';

import client from './axios';

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
};
