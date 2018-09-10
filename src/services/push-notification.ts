import RNPushNotification, { PushNotification, PushNotificationObject } from 'react-native-push-notification';
import { Alert } from 'react-native';

type onRegisterToken = (token: { os: string, token: string }) => void;
export default class PushNotificationService {
  lastId: number;

  constructor(onRegister: onRegisterToken) {
    this.configure(onRegister);
    this.lastId = 0;
  }

  private onNotificationReceived = (notification: PushNotification) => {
    Alert.alert("A wonder-ful message for you", notification.message.toString());
  }

  configure(onRegister: onRegisterToken, gcm: string = "") {
    RNPushNotification.configure(
      {
        onRegister,
        onNotification: this.onNotificationReceived,
        senderID: gcm,
        popInitialNotification: true,
        requestPermissions: true
      }
    );
  }
  localNotification = (content: PushNotificationObject): void => {
    RNPushNotification.presentLocalNotification(content);
  }
}
