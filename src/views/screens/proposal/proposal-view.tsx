import React from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from 'src/views/components/screen';
import ProposalSwiper from 'src/views/components/proposal-swiper/proposal-swiper';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  getNewProposal,
  rateProposal,
  getNextProposal,
  clearProposals
} from 'src/store/sagas/proposal';

import FoundMatchModal from 'src/views/components/modals/found-match-modal';
import { persistCurrentMatch } from 'src/store/reducers/wonder';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { selectCurrentUser } from 'src/store/selectors/user';
import WonderAppState from 'src/models/wonder-app-state';
import Proposal from 'src/models/proposal';
import User from 'src/models/user';
import { updateUser } from '../../../store/sagas/user';
import {
  getConversations,
  getConversation
} from 'src/store/sagas/conversations';

import PushNotificationService from '../../../services/push-notification';
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
    tzinfo: string;
    tzoffset: number;
  }) => dispatch(updateUser(data)),
  updateTZ: (data: {
    tzinfo: string;
    tzoffset: number;
  }) => dispatch(updateUser(data)),
  onGetNewProposal: () => dispatch(getNewProposal()),
  clearProposals: () => dispatch(clearProposals()),
  getNextProposal: (limit: number) => dispatch(getNextProposal(limit)),
  onLeftSwipe: (proposal: Proposal) =>
    dispatch(rateProposal({ proposal, liked: false })),
  onRightSwipe: (proposal: Proposal) =>
    dispatch(rateProposal({ proposal, liked: true })),
  onClearCurrentMatch: () => dispatch(persistCurrentMatch({})),
  onRefreshConversations: () => dispatch(getConversations()),
  onGetConversation: (partnerId: number) =>
    dispatch(getConversation({ id: partnerId, successRoute: 'Chat' }))
});

type Candidate = Partial<User>;

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  clearProposals: () => void;
  getNextProposal: (limit: number) => void;
  onGetNewProposal: Function;
  onClearCurrentMatch: Function;
  onLeftSwipe: Function;
  onRightSwipe: Function;
  proposal: WonderAppState['wonder']['proposal'];
  currentUser: User;
  currentMatch: Proposal;
  onGetConversation: Function;
  onRefreshConversations: Function;
  updatePushToken: (
    data: {
      push_device_id: string;
      push_device_type: string;
      tzinfo: string;
      tzoffset: number;
    }
  ) => void;
  updateTZ: (
    data: {
      tzinfo: string;
      tzoffset: number;
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

  componentDidMount() {
    const { proposal, updatePushToken, updateTZ, currentUser } = this.props;
    // Get a (guaranteed to be) new batch of 5 proposals

    this.setCandidate(null);
    this.props.getNextProposal(5);

    PushNotificationService.onRegister = (token: RNPushNotificationToken) => {
      const newDeviceId =
        !currentUser.push_device_id ||
        currentUser.push_device_id !== token.token;

      if (newDeviceId) {
        updatePushToken({
          push_device_id: token.token,
          push_device_type: token.os === 'ios' ? 'apns' : 'fcm',
          tzinfo: DeviceInfo.getTimezone(),
          tzoffset: (new Date()).getTimezoneOffset() / 60
        });
      } else {
        updateTZ({
          tzinfo: DeviceInfo.getTimezone(),
          tzoffset: (new Date()).getTimezoneOffset() / 60
        });
      }
    };

    PushNotificationService.configure(currentUser);
  }

  setCandidate = (candidate?: Candidate | null) => {
    this.setState({ candidate });
  }

  clearCandidate = () => {
    this.setState({ candidate: null });
  }

  clearCurrentMatch = () => {
    this.props.onClearCurrentMatch();
    this.props.onRefreshConversations();
  }

  goToChat = () => {
    const { onGetConversation, currentMatch } = this.props;
    this.props.onClearCurrentMatch();
    this.props.onRefreshConversations();
    onGetConversation(currentMatch.candidate.id);
  }

  swipeRight = (index: number) => {
    const { proposal } = this.props;
    this.props.onRightSwipe(proposal[index]);
  }

  swipeLeft = (index: number) => {
    const { proposal } = this.props;
    this.props.onLeftSwipe(proposal[index]);
  }

  private localClearProposals = (): void => {
    this.props.clearProposals();
    // this.props.getNextProposal(5);
  }

  render() {
    const { proposal, currentMatch, currentUser } = this.props;
    console.log(currentUser);
    return (
      <Screen>
        <View style={styles.flex1}>
          <ProposalSwiper
            currentUser={currentUser}
            proposal={proposal}
            onSwipeRight={this.swipeRight}
            onSwipeLeft={this.swipeLeft}
            clearProposals={this.localClearProposals}
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

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  }
});

export default connect(
  mapState,
  mapDispatch
)(ProposalViewScreen);
