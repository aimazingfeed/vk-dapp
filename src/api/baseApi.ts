import { AxiosResponse } from 'axios';

import client from './axios';

export const baseApi = {
  getNonce: (params: { address }): Promise<AxiosResponse<string>> => client.get('get_address_nonce', { params }),
  setAddressNonce: (params: { address; signature }): Promise<AxiosResponse<string>> =>
    client.get('bind_address', { params }),
  getAddresses: (): Promise<AxiosResponse<string[]>> => client.get('my_addresses'),
};
