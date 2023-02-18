import { api } from 'appConstants';
import axios, { AxiosInstance } from 'axios';
import { validateStatus } from 'utils';

const client: AxiosInstance = axios.create({
  baseURL: api,
  validateStatus,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${window.location.search.slice(1)}`,
  },
});

export default client;
