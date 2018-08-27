import React from 'react';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import Screen from 'src/views/components/screen';
import theme from 'src/assets/styles/theme';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import ChatActionButton from 'src/views/components/chat/chat-action-button';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getConversation, sendMessage } from 'src/store/sagas/conversations';
import { getDecoratedConversation } from 'src/store/selectors/conversation';
import { selectCurrentUser } from 'src/store/selectors/user';
import User from 'src/models/user';
import { DecoratedConversation, ConversationNewMessage } from 'src/models/conversation';
import WonderAppState from 'src/models/wonder-app-state';
import Chat from 'src/models/chat';
import ChatResponseMessage from 'src/models/chat-response-message';
import { AppointmentState, persistAppointmentData } from '../../../store/reducers/appointment';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  currentUser: User;
  conversation: DecoratedConversation;
  onGetMessage: (userId: number) => void;
  onSendMessage: (chatMessage: ConversationNewMessage) => void;
  onUpdateAppointment: (data: AppointmentState) => void;
}

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state),
  conversation: getDecoratedConversation(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onGetMessage: (userId: number) => dispatch(getConversation(userId)),
  onSendMessage: (data: any) => dispatch(sendMessage(data)),
  onUpdateAppointment: (data: AppointmentState) =>
    dispatch(persistAppointmentData(data))
});

class ChatScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, NavigationParams> }) => ({
    title: 'Chat',
  })

  getChat = (): Chat => {
    const { navigation } = this.props;
    return (navigation.getParam('chat') as Chat);
  }

  scheduleWonder = () => {
    const { navigation, conversation, onUpdateAppointment } = this.props;
    onUpdateAppointment({ match: conversation.partner });
    navigation.navigate('WonderMap', { id: conversation.partner.id });
  }

  onSend = (messages: ChatResponseMessage[] = []) => {
    const { conversation } = this.props;
    this.props.onSendMessage({ conversation_id: conversation.partner.id, message: { body: messages[0].text } });
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
    const { currentUser, conversation } = this.props;
    return (
      <Screen>
        <GiftedChat
          user={{ _id: currentUser.id }}
          renderBubble={this.renderBubble}
          messages={conversation.giftedChatMessages}
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
