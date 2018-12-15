import { setAlertModal } from '@actions';
import * as alertTexts from '@texts';

export const getStore = () => require('@store').store;
export const getStoreState = () => getStore().getState();

export const handleAxiosError = (error: any) => {
  if (error.response) {
    const { data, config } = error.response;
    const { dispatch } = getStore();

    // TODO: map the error responses to texts to them dispatch here

    dispatch(
      setAlertModal({
        ...alertTexts.loginAlertTexts
      })
    );

    // Alert.alert(
    //   `HTTP ${error.response.status}`,
    //   JSON.stringify(
    //     {
    //       ...data,
    //       url: config.url,
    //       method: config.method
    //     },
    //     null,
    //     2
    //   )
    // );
  } else {
    // tslint:disable-next-line
    console.log(`error:`, error);
    console.warn(error);
  }
};
