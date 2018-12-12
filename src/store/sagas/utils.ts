import { Alert } from 'react-native';

export const handleAxiosError = (error: any) => {
  if (error.response) {
    const { data, config } = error.response;
    Alert.alert(
      `HTTP ${error.response.status}`,
      JSON.stringify(
        {
          ...data,
          url: config.url,
          method: config.method
        },
        null,
        2
      )
    );
  } else {
    // tslint:disable-next-line
    console.log(`error:`, error);
    console.warn(error);
  }
};
