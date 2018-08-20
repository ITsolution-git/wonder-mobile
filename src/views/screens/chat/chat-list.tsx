import React from 'react';
import Screen from '../../components/screen';
import { ChatList } from '../../components/chat';
import { Title } from '../../components/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import Chat from '../../../types/chat';
import WonderAppState from '../../../types/wonder-app-state';
import { Dispatch } from 'redux';
import { getConversations, getConversation } from '../../../store/sagas/conversations';
import Conversation from '../../../types/conversation';
import { connect } from 'react-redux';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  conversations: Conversation[];
  onRefreshConversations: Function;
  onGetConversation: Function;
}

const mapState = (state: WonderAppState) => ({
  currentUser: state.user.profile,
  conversations: state.chat.conversations
});

const mapDispatch = (dispatch: Dispatch) => ({
  onRefreshConversations: () => dispatch(getConversations()),
  onGetConversation: (partnerId: number) => dispatch(getConversation(partnerId))
});

class ChatListScreen extends React.Component<Props> {
  componentWillMount() {
    this.props.onRefreshConversations();
  }

  goToChat = (chat: Chat) => {
    const { navigation, onGetConversation } = this.props;
    onGetConversation(chat.partner.id);
    navigation.navigate('Chat', { chat });
  }

  render() {
    const { conversations } = this.props;
    return (
      <Screen horizontalPadding={20}>
        <Title>Latest Matches</Title>
        <ChatList
          chats={conversations}
          onPressChat={this.goToChat}
        />
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(ChatListScreen);
