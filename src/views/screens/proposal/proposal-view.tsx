import React from 'react';
import { View, Alert } from 'react-native';
import Screen from '../../components/screen';
import ProposalSwiper from '../../components/proposal-swiper/proposal-swiper';
import Proposal from '../../../types/proposal';
import WonderAppState from '../../../types/wonder-app-state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { getNewProposal, rateProposal } from '../../../store/sagas/proposal';
import User from '../../../types/user';
import ProfileModal from '../../components/modals/profile-modal';
import FoundMatchModal from '../../components/modals/found-match-modal';
import { persistCurrentMatch } from '../../../store/reducers/wonder';
import { NavigationScreenProp, NavigationParams } from '../../../../node_modules/@types/react-navigation';

const mapState = (state: WonderAppState) => ({
  currentUser: state.user.profile,
  proposal: state.wonder.proposal,
  currentMatch: state.wonder.currentMatch
});

const mapDispatch = (dispatch: Dispatch) => ({
  onGetNewProposal: () => dispatch(getNewProposal()),
  onLeftSwipe: (proposal: Proposal) => dispatch(rateProposal({ proposal, liked: false })),
  onRightSwipe: (proposal: Proposal) => dispatch(rateProposal({ proposal, liked: true })),
  onClearCurrentMatch: () => dispatch(persistCurrentMatch({}))
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
    // Get a new proposal if it has been voted for or if none exist
    if (!this.props.proposal || this.props.proposal.id) {
      this.props.onGetNewProposal();
      this.setCandidate(null);
    }
  }

  setCandidate = (candidate?: Candidate | null) => {
    this.setState({ candidate });
  }

  clearCandidate = () => {
    this.setState({ candidate: null });
  }

  clearCurrentMatch = () => {
    this.props.onClearCurrentMatch();
  }

  goToChat = (proposal: Proposal) => {
    const { navigation } = this.props;

  }

  render() {
    const { proposal, onLeftSwipe, onRightSwipe, currentMatch, currentUser } = this.props;
    const { candidate } = this.state;
    return (
      <Screen horizontalPadding={10}>
        <View style={{ flex: 1 }}>
          <ProposalSwiper
            proposal={proposal}
            onSwipeRight={onRightSwipe}
            onSwipeLeft={onLeftSwipe}
            onTap={this.setCandidate}
          />
        </View>
        <ProfileModal
          animationType="slide"
          visible={!!candidate}
          candidate={candidate}
          onCancel={this.clearCandidate}
          onRequestClose={this.clearCandidate}
        />
        <FoundMatchModal
          currentUser={currentUser}
          onSuccess={this.goToChat}
          onRequestClose={this.clearCurrentMatch}
          visible={!!(currentMatch && currentMatch.has_match)}
          proposal={currentMatch}
        />
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(ProposalViewScreen);