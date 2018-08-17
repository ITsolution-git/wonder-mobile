import React from 'react';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import Screen from 'src/views/components/screen';
import Chat from 'src/types/chat';
import theme from 'src/assets/styles/theme';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import ChatActionButton from 'src/views/components/chat/chat-action-button';
import ChatMessage from 'src/types/chat-message';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import WonderAppState from 'src/types/wonder-app-state';
import User from 'src/types/user';
import { getConversation, sendMessage } from 'src/store/sagas/conversations';
import Conversation from 'src/types/conversation';
import ChatResponseMessage from 'src/types/chat-response-message';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  currentUser: User;
  messages: ChatMessage[];
  conversation: Conversation;
  onGetMessage: (userId: number) => any;
  onSendMessage: (data: any) => any;
}

interface State {
  messages: ChatMessage[];
  conversation: Conversation;
}

const mapState = (state: WonderAppState) => ({
  currentUser: state.user.profile,
  conversation: state.chat.conversation
});

const mapDispatch = (dispatch: Dispatch) => ({
  onGetMessage: (userId: number) => dispatch(getConversation(userId)),
  onSendMessage: (data: any) => dispatch(sendMessage(data)),
});

class ChatScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, NavigationParams> }) => ({
    title: (navigation.getParam('chat') as Chat).partner ? (navigation.getParam('chat') as Chat).partner.first_name : 'Chat',
  })

  componentWillReceiveProps(nextProps: Props) {
    const arrSelected = nextProps.conversation.messages.map((item: ChatResponseMessage) => {
      const message: ChatMessage = {
        _id: item.id,
        text: item.body,
        createdAt: new Date(item.sent_at),
        user: {
          _id: item.sender_id,
          name: (item.sender_id === this.props.currentUser.id ? this.props.currentUser.first_name : this.getChat().partner.first_name) || '',
          avatar: item.sender_id === this.props.currentUser.id ? ((this.props.currentUser.images && this.props.currentUser.images.length) ? this.props.currentUser.images[0].url : null) : ((this.getChat().partner.images && this.getChat().partner.images.length) ? this.getChat().partner.images[0].url : null),
        }
      };
      return message;
    });
    this.setState({
      messages: arrSelected
    });
  }

  getChat = (): Chat => {
    const { navigation } = this.props;
    return (navigation.getParam('chat') as Chat);
  }

  componentWillMount() {
    const { currentUser, onGetMessage } = this.props;
    onGetMessage(this.getChat().partner.id);
    this.setState({
      messages: []
    });
  }

  scheduleWonder = () => {
    const { onScheduleWonder, navigation } = this.props;
    navigation.navigate('WonderMap', { id: this.getChat().partner.id });
  }

  onSend = (messages: ChatMessage[] = []) => {
    this.setState((previousState: State) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    const data = { message: { body: messages[0].text } };
    this.props.onSendMessage({ recipient_id: this.getChat().partner.id, data });
  }

  renderBubble(props: any) {
    return (
      <Bubble
        {...props}
        textStyle={bubbleTextStyle}
        wrapperStyle={bubbleWrapperStyle}
      />
    );
  }

  renderFooter = () => {
    return (
      <View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'center' }}>
        <View style={{ width: '50%' }}>
          <ChatActionButton
            title="Schedule Wonder"
            onPress={this.scheduleWonder}
          />
        </View>
      </View>
    );
  }

  render() {
    const { currentUser } = this.props;
    const messages = this.state.messages == null ? [] : this.state.messages;
    return (
      <Screen>
        <GiftedChat
          user={{ _id: currentUser.id }}
          renderBubble={this.renderBubble}
          messages={messages}
          renderFooter={this.renderFooter}
          onSend={this.onSend}
        />
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(ChatScreen);
const bubbleTextStyle = StyleSheet.create({
  right: {
    color: '#000'
  },
  left: {
    color: '#FFF',
  }
});

const bubbleWrapperStyle = StyleSheet.create({
  right: {
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: 3,
      height: 1
    },
    backgroundColor: '#FFF',
  },
  left: {
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: 'blue',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: -3,
      height: 1
    },
    backgroundColor: theme.colors.primaryLight,
  },
});

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
});
