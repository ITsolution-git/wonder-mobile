import React from 'react';
import { View } from 'react-native';
import Screen from 'src/views/components/screen';
import ProposalSwiper from 'src/views/components/proposal-swiper/proposal-swiper';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { getNewProposal, rateProposal } from 'src/store/sagas/proposal';

import FoundMatchModal from 'src/views/components/modals/found-match-modal';
import { persistCurrentMatch } from 'src/store/reducers/wonder';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { selectCurrentUser } from 'src/store/selectors/user';
import WonderAppState from 'src/models/wonder-app-state';
import Proposal from 'src/models/proposal';
import User from 'src/models/user';
import PushNotificationService from '../../../services/push-notification';
import { updateUser } from '../../../store/sagas/user';
import { getConversations } from 'src/store/sagas/conversations';
import { RNPushNotificationToken } from '../../../services/push-notification';

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state),
  proposal: state.wonder.proposal,
  currentMatch: state.wonder.currentMatch
});

const mapDispatch = (dispatch: Dispatch) => ({
  updatePushToken: (data: {
    push_device_id: string;
    push_device_type: string;
  }) => dispatch(updateUser(data)),
  onGetNewProposal: () => dispatch(getNewProposal()),
  onLeftSwipe: (proposal: Proposal) =>
    dispatch(rateProposal({ proposal, liked: false })),
  onRightSwipe: (proposal: Proposal) =>
    dispatch(rateProposal({ proposal, liked: true })),
  onClearCurrentMatch: () => dispatch(persistCurrentMatch({})),
  onRefreshConversations: () => dispatch(getConversations())
});

type Candidate = Partial<User>;

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  onGetNewProposal: Function;
  onClearCurrentMatch: Function;
  onLeftSwipe: Function;
  onRightSwipe: Function;
  proposal: Proposal | null;
  currentUser: User;
  currentMatch: Proposal;
  updatePushToken: (
    data: {
      push_device_id: string;
      push_device_type: string;
    }
  ) => void;
}

interface State {
  candidate?: Candidate | null;
  isModalOpen: boolean;
}

class ProposalViewScreen extends React.Component<Props, State> {
  state: State = {
    candidate: null,
    isModalOpen: false
  };

  componentWillMount() {
    const { updatePushToken, currentUser } = this.props;
    // Get a new proposal if it has been voted for or if none exist
    if (!this.props.proposal || this.props.proposal.id) {
      this.props.onGetNewProposal();
      this.setCandidate(null);
    }

    PushNotificationService.onRegister = (token: RNPushNotificationToken) => {
      const newDeviceId =
        !currentUser.push_device_id ||
        currentUser.push_device_id !== token.token;

      if (newDeviceId) {
        updatePushToken({
          push_device_id: token.token,
          push_device_type: token.os === 'ios' ? 'apns' : 'fcm'
        });
      }
    };

    PushNotificationService.configure(currentUser);
  }

  setCandidate = (candidate?: Candidate | null) => {
    this.setState({ candidate });
  };

  clearCandidate = () => {
    this.setState({ candidate: null });
  };

  clearCurrentMatch = () => {
    this.props.onClearCurrentMatch();
  };

  goToChat = () => {
    const { navigation } = this.props;
    this.props.onClearCurrentMatch();
    this.props.onRefreshConversations();
    navigation.navigate('ChatList');
  };

  render() {
    const {
      proposal,
      onLeftSwipe,
      onRightSwipe,
      currentMatch,
      currentUser
    } = this.props;
    return (
      <Screen>
        <View style={{ flex: 1 }}>
          <ProposalSwiper
            currentUser={currentUser}
            proposal={proposal}
            onSwipeRight={onRightSwipe}
            onSwipeLeft={onLeftSwipe}
            // onTap={this.setCandidate}
          />
        </View>
        <FoundMatchModal
          currentUser={currentUser}
          onSuccess={this.goToChat}
          onRequestClose={this.clearCurrentMatch}
          visible={Object.keys(currentMatch).length > 0}
          proposal={currentMatch}
        />
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(ProposalViewScreen);
