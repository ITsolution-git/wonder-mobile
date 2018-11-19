import React from "react";
import WonderAppState from "../../models/wonder-app-state";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { updateUser } from "src/store/sagas/user";
import { selectCurrentUser } from "src/store/selectors/user";

const mapState = (state: WonderAppState) => ({
  token: state.user.auth.token,
  currentUser: selectCurrentUser(state),
});

const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: UserPushNotificationOptions) => dispatch(updateUser(data)),
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
  componentDidMount() {
    if (this.props.token) {
      this.props.navigation.navigate("Main");
      return;
    }
    this.props.navigation.navigate("onboarding");
  }

  render() {
    return null;
  }
}

export default connect(
  mapState,
  mapDispatch,
)(AppLoadingScreen);
