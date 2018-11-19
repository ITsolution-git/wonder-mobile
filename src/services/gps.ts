import {
  PermissionsAndroid,
  Platform,
  Alert,
  GeolocationReturnType,
  GeolocationError,
} from 'react-native';

export type GeolocationSuccessCallback = (
  position: GeolocationReturnType,
) => any;
export type GeolocationErrorCallback = (position: GeolocationError) => any;

const defaultOnError = (error: GeolocationError) => Alert.alert(error.message);
const askForDeviceLocation = async (
  onSuccess: GeolocationSuccessCallback,
  onError: GeolocationErrorCallback = defaultOnError,
) => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Wonder would like your location',
        message: 'Use your location to find activities near you',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getDeviceLocation(onSuccess, onError);
    }
  } else {
    // iOS
    getDeviceLocation(onSuccess, onError);
  }
};

export const getDeviceLocation = (
  onSuccess: GeolocationSuccessCallback,
  onError: GeolocationErrorCallback,
) => {
  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 1000,
  });

  // navigator.geolocation.watchPosition(
  //   onSuccess,
  //   onError
  // );
};

export default askForDeviceLocation;
