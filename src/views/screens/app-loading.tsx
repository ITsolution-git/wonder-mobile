import React from 'react';
import WonderAppState from "../../models/wonder-app-state";
import { Alert } from 'react-native';
import { Dispatch } from "redux";
import { connect } from 'react-redux';
import { updateUser } from 'src/store/sagas/user';
import { selectCurrentUser } from 'src/store/selectors/user';
import PushNotificationService from '../../services/push-notification';
import { PushNotificationObject, PushNotification } from 'react-native-push-notification';

const mapState = (state: WonderAppState) => ({
  token: state.user.auth.token,
  currentUser: selectCurrentUser(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: PNRegistration) => dispatch(updateUser(data))
});

interface Props {
  navigation: any;
  token?: string | null;
  onSave: Function
}

interface PNRegistration {
  apn_device_id: string,
  apn_device_name: string
}

class AppLoadingScreen extends React.Component<Props> {
  pnsvc: PushNotificationService;

  constructor(props: any) {
    super(props);

    this.pnsvc = new PushNotificationService(this.onPNRegister.bind(this), this.onPNNotification.bind(this));
  }


  componentDidMount() {
    this.pnsvc.testNotification();

    if (this.props.token) {
      this.props.navigation.navigate('Main');
      return;
    }
    this.props.navigation.navigate('onboarding');
  }
  render() {
    return null;
  }

  

  onPNRegister = (token:any) => {
    this.props.onSave({ push_device_id: token.token, push_device_type: token.os});
  }

  onPNNotification = (notification:PushNotification) => {
    Alert.alert(notification.title || "A wonder-ful message for you", notification.message)
  }

}

export default connect(mapState, mapDispatch)(AppLoadingScreen);
