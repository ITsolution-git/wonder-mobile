import axios, { AxiosRequestConfig } from 'axios';
import { UserState } from '../store/reducers/user';

const wonderApi = axios.create({
  baseURL: 'https://api.getwonderapp.com/v1',
  // timeout: 1000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const api = (opts: AxiosRequestConfig, userState?: UserState) => {
  if (userState && userState.auth && userState.auth.token) {
    opts.headers = {
      ...opts.headers,
      Authorization: `Bearer ${userState.auth.token}`
    };
  }

  return wonderApi(opts);
};

export { wonderApi as ApiConfig };
export default api;
