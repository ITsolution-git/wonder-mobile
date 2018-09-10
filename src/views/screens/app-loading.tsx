import React from 'react';
import WonderAppState from "../../models/wonder-app-state";
import { Dispatch } from "redux";
import { connect } from 'react-redux';
import { updateUser } from 'src/store/sagas/user';
import { selectCurrentUser } from 'src/store/selectors/user';
import PushNotificationService from 'src/services/push-notification';

const mapState = (state: WonderAppState) => ({
  token: state.user.auth.token,
  currentUser: selectCurrentUser(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: UserPushNotificationOptions) => dispatch(updateUser(data))
});

interface Props {
  navigation: any;
  token?: string | null;
  onSave: (data: UserPushNotificationOptions) => void;
}

interface UserPushNotificationOptions {
  push_device_id: string;
  push_device_type: string;
}

class AppLoadingScreen extends React.Component<Props> {
  pushNotificationService: PushNotificationService;

  constructor(props: any) {
    super(props);

    this.pushNotificationService = new PushNotificationService(this.onPNRegister);
  }

  componentDidMount() {
    // this.pushNotificationService.localNotification({
    //   /* Android Only Properties */
    //   id: Date.now().toString(),
    //   ticker: "Wonder-ful Ticker", // (optional)
    //   autoCancel: true, // (optional) default: true
    //   largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
    //   smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    //   bigText: "Test Big Text", // (optional) default: "message" prop
    //   subText: "This is only a test", // (optional) default: none
    //   color: "red", // (optional) default: system default
    //   vibrate: true, // (optional) default: true
    //   vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    //   tag: 'some_tag', // (optional) add tag to message
    //   group: "group", // (optional) add group to message
    //   ongoing: false, // (optional) set whether this is an "ongoing" notification

    //   /* iOS only properties */
    //   alertAction: 'view', // (optional) default: view
    //   category: '', // (optional) default: null
    //   userInfo: {}, // (optional) default: null (object containing additional notification data)

    //   /* iOS and Android properties */
    //   title: "Wonder Test Message", // (optional)
    //   message: "You are wonder-ful", // (required)
    //   playSound: false, // (optional) default: true
    //   soundName: 'default',
    //   actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
    // });

    if (this.props.token) {
      this.props.navigation.navigate('Main');
      return;
    }
    this.props.navigation.navigate('onboarding');
  }

  render() {
    return null;
  }

  onPNRegister = (token: any) => {
    // Is the user autheticated
    if (this.props.token) {
      this.props.onSave({ push_device_id: token.token, push_device_type: token.os });
    }
  }

}

export default connect(mapState, mapDispatch)(AppLoadingScreen);
