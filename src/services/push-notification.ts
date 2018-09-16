import RNPushNotification, {
  PushNotification,
  PushNotificationObject
} from "react-native-push-notification";
import { Alert } from "react-native";

interface RNPushNotificationToken {
  os: string;
  token: string;
}
type onRegisterToken = (token: RNPushNotificationToken) => void;

class PushNotificationService {
  public token?: RNPushNotificationToken;
  public onRegister?: onRegisterToken;
  public onNotification?: (notification: PushNotificationObject) => void;
  private lastId: number = 0;

  private handleRegister = (token: RNPushNotificationToken) => {
    this.token = token;
    if (this.onRegister) {
      this.onRegister(token);
    }
  }

  private handleNotificationReceived = (notification: PushNotification) => {
    Alert.alert(
      "A wonder-ful message for you",
      notification.message.toString()
    );
  }

  configure(gcm?: string) {
    RNPushNotification.configure({
      onRegister: this.handleRegister,
      onNotification: this.handleNotificationReceived,
      senderID: gcm,
      popInitialNotification: true,
      requestPermissions: true
    });
  }

  localNotification = (content: PushNotificationObject): void => {
    RNPushNotification.presentLocalNotification(content);
  }
}

export default new PushNotificationService();
