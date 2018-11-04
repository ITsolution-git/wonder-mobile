import RNPushNotification, {
  PushNotification,
  PushNotificationObject
} from 'react-native-push-notification';

import { NavigationActions } from 'react-navigation';

import NavigationService from './navigation';
import { DecoratedAppointment } from '../models/appointment';
import { decorateAppointment } from '../store/selectors/appointment';
import User from '../models/user';
export interface RNPushNotificationToken {
  os: string;
  token: string;
}
type onRegisterToken = (token: RNPushNotificationToken) => void;

interface WonderPushNotification extends PushNotification {
  type?: string;
  extra?: string;
}

interface NotificationPayload {
  type?: string;
  extra?: string;
}

class PushNotificationService {
  public token?: RNPushNotificationToken;
  public onRegister?: onRegisterToken;
  public onNotification?: (notification: PushNotificationObject) => void;
  private lastId: number = 0;
  private senderID: string = '487922911515';
  private user?: User;

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

  private parseNotification = (notification: WonderPushNotification) => {
    const error = {
      type: null,
      partnerId: null,
      appointment: null
    };

    if (!this.token || (this.token.os === 'ios' && !notification.data)) {
      return error;
    }

    const payload: NotificationPayload =
      this.token.os === 'ios' ? notification.data : notification;
    const { extra, type } = payload;
    const extraData = extra
      ? JSON.parse(extra)
      : { partner_id: null, appointment: null };

    const { partner_id, appointment } = extraData;
    return {
      type,
      partnerId: partner_id,
      appointment:
        appointment && this.user
          ? decorateAppointment(appointment, this.user)
          : null
    };
  };

  private handleNotificationReceived = (
    notification: WonderPushNotification
  ) => {
    const { foreground, userInteraction } = notification;
    if (!foreground && userInteraction) {
      const payload = this.parseNotification(notification);
      const { type, partnerId, appointment } = payload;

      if (
        (type === 'upcoming_date' || type === 'confirm_date') &&
        appointment
      ) {
        this.resetToDate('UpcomingAppointmentView', appointment, false);
      } else if (type === 'new_message' && partnerId) {
        this.resetToChat(partnerId, 'none');
      } else if (type === 'ghosting' && partnerId) {
        this.resetToChat(partnerId, 'ghosting');
      } else if (type === 'new_match' && partnerId) {
        this.resetToChat(partnerId, 'profile');
      } else if (type === 'gift_date' && appointment) {
        this.resetToDate('PastAppointmentView', appointment, false);
      } else if (type === 'review_date' && appointment) {
        this.resetToDate('PastAppointmentView', appointment, true);
      }
    }
  };

  configure(user: User) {
    this.user = user;
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
