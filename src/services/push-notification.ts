import RNPushNotification, {
  PushNotification,
  PushNotificationObject
} from 'react-native-push-notification';

import { NavigationActions } from 'react-navigation';

import NavigationService from './navigation';
import { DecoratedAppointment } from '../models/appointment';
export interface RNPushNotificationToken {
  os: string;
  token: string;
}
type onRegisterToken = (token: RNPushNotificationToken) => void;

interface WonderPushNotification extends PushNotification {
  type?: string;
  extra?: string;
}

class PushNotificationService {
  public token?: RNPushNotificationToken;
  public onRegister?: onRegisterToken;
  public onNotification?: (notification: PushNotificationObject) => void;
  private lastId: number = 0;
  private senderID: string = '487922911515';

  private handleRegister = (token: RNPushNotificationToken) => {
    this.token = token;
    if (this.onRegister) {
      this.onRegister(token);
    }
  };

  private resetToDate = (
    destination: string,
    appointment: DecoratedAppointment | null,
    review: boolean
  ) => {
    NavigationService.reset('Main', 'onboarding');
    NavigationService.navigate('User');
    NavigationService.navigate('Upcoming');
    NavigationService.navigate(destination, { appointment, review });
  };

  private resetToChat = (partnerId: number, redirect: string) => {
    NavigationService.reset('Main', 'onboarding');
    NavigationService.navigate(
      'Messages',
      {},
      NavigationActions.navigate({
        routeName: 'ChatList',
        params: { partnerId, redirect }
      })
    );
  };

  private handleNotificationReceived = (
    notification: WonderPushNotification
  ) => {
    console.log('on notification', notification);
    const { foreground, userInteraction, type, extra } = notification;
    if (!foreground && userInteraction && type && extra) {
      const extraData = JSON.parse(extra);
      const { appointment, partnerId } = extraData;

      if (type === 'upcoming_date' || type === 'confirm_date') {
        this.resetToDate('UpcomingAppointmentView', appointment, false);
      } else if (type === 'new_message') {
        this.resetToChat(partnerId, 'none');
      } else if (type === 'ghosting') {
        this.resetToChat(partnerId, 'ghosting');
      } else if (type === 'new_match') {
        this.resetToChat(partnerId, 'profile');
      } else if (type === 'gift_date') {
        this.resetToDate('PastAppointmentView', appointment, false);
      } else if (type === 'review_date') {
        this.resetToDate('PastAppointmentView', appointment, true);
      }
    }
  };

  configure() {
    RNPushNotification.configure({
      onRegister: this.handleRegister,
      onNotification: (notification: WonderPushNotification) =>
        this.handleNotificationReceived(notification),
      senderID: this.senderID,
      popInitialNotification: true,
      requestPermissions: true
    });
  }

  localNotification = (content: PushNotificationObject): void => {
    RNPushNotification.presentLocalNotification(content);
  };
}

export default new PushNotificationService();
