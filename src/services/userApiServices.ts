import { ApiConfig } from './api';

export const checkUniqueness = async (params: {
  email?: string;
  phone?: string;
}): Promise<boolean> => {
  try {
    const res = await ApiConfig.request({
      url: `/users/uniqueness`,
      method: 'get',
      params
    });

    console.log(`uniqueness params and response:`, params, res);
    console.log(`isUnique:`, res.data.unique);

    return res.data.unique;
  } catch (err) {
    console.log(`error:`, err.response);
    return false;
  }
};
