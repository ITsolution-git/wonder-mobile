import React from 'react';
import Screen from 'src/views/components/screen';
import { ChatList } from 'src/views/components/chat';
import { Title } from 'src/views/components/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';

import { Dispatch } from 'redux';
import { getConversations, getConversation } from 'src/store/sagas/conversations';

import { connect } from 'react-redux';
import { selectCurrentUser } from 'src/store/selectors/user';
import Conversation from 'src/models/conversation';
import WonderAppState from 'src/models/wonder-app-state';
import Chat from 'src/models/chat';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  conversations: Conversation[];
  onRefreshConversations: Function;
  onGetConversation: Function;
}

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state),
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
