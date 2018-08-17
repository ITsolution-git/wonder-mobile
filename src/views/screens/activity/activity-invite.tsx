import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import WonderAppState from '../../../types/wonder-app-state';
import Screen from '../../components/screen';

const mapState = (state: WonderAppState) => ({
  currentUser: state.user.profile
});

const mapDispatch = (dispatch: Dispatch) => ({

});

class ActivityInviteScreen extends React.Component {
  render() {
    return (
      <Screen horizontalPadding={20}>

      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(ActivityInviteScreen);