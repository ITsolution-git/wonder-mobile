import ActionCable from 'react-native-actioncable';
import React from 'react';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import Screen from 'src/views/components/screen';
import theme from 'src/assets/styles/theme';
import { View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import ChatActionButton from 'src/views/components/chat/chat-action-button';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getConversation, sendMessage } from 'src/store/sagas/conversations';
import { getDecoratedConversation } from 'src/store/selectors/conversation';
import { selectCurrentUser } from 'src/store/selectors/user';
import User from 'src/models/user';
import { DecoratedConversation, ConversationNewMessage } from 'src/models/conversation';
import ChatGhostingModal from '../../components/modals/chat-ghosting-modal';
import WonderAppState from 'src/models/wonder-app-state';
import ChatResponseMessage from 'src/models/chat-response-message';
import { AppointmentState, persistAppointmentData } from 'src/store/reducers/appointment';
import { DOMAIN } from 'src/services/api';
import { IconButton } from '../../components/theme';
import Assets from 'src/assets/images';


interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  currentUser: User;
  token: string;
  conversation: DecoratedConversation;
  onGetMessage: (userId: number) => void;
  onSendMessage: (chatMessage: ConversationNewMessage) => void;
  onUpdateAppointment: (data: AppointmentState) => void;
}

interface ChatViewState {
  isGhostingModalOpen: boolean;
}

const mapState = (state: WonderAppState) => ({
  token: state.user.auth.token,
  currentUser: selectCurrentUser(state),
  conversation: getDecoratedConversation(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onGetMessage: (userId: number) => dispatch(getConversation({ id: userId })),
  onSendMessage: (data: any) => dispatch(sendMessage(data)),
  onUpdateAppointment: (data: AppointmentState) =>
    dispatch(persistAppointmentData(data))
});

class ChatScreen extends React.Component<Props> {
  cable: any;
  appChat: any;
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, NavigationParams> }) => ({
    title: 'Chat',
  })

  state: ChatViewState = {
    isGhostingModalOpen: false
  }

  componentWillMount() {
    const { conversation, token, onGetMessage } = this.props;
    this.appChat = {};
    this.cable = ActionCable.createConsumer(`wss://${DOMAIN}/cable?token=${token}`);
    this.appChat = this.cable.subscriptions.create({
      channel: "ConversationChannel",
      recipient_id: conversation.partner.id
    }, {
        connected() {
          console.log('Connected to Chat', conversation.id);
          // this.perform('deliver', { body: new Date().toString() });
          // this.perform('read', { message_id: conversation.partner.id });
        },
        received: (data: any) => {
          onGetMessage(conversation.partner.id);
          console.log('message', data);
        },
        deliver(message: string) {
          this.perform('deliver', { body: message });
        },
        disconnected: () => {
          // alert('disconnected');
        },
      });
  }

  componentWillUnmount() {
    if (this.appChat) {
      this.cable.subscriptions.remove(this.appChat);
    }
  }

  scheduleWonder = () => {
    const { navigation, conversation, onUpdateAppointment } = this.props;
    onUpdateAppointment({ match: conversation.partner });
    navigation.navigate('WonderMap', { id: conversation.partner.id });
  }

  ghostPartner = (ghostMessage: string) => {
    const { conversation } = this.props;
    this.props.conversation.giftedChatMessages.push(new GiftedChatMessage())
    this.appChat.deliver(ghostMessage)  //  Send the message
  }

  openGhostingModal = () => {
    this.setState({ isGhostingModalOpen: true });
  }

  closeGhostingModal = () => {
    this.setState({ isGhostingModalOpen: false });
  }

  onSend = (messages: ChatResponseMessage[] = []) => {
    this.appChat.deliver(messages[0].text);
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
          <TouchableOpacity onPress={this.openGhostingModal}>
            <Image source={Assets.GhostButton} />
          </TouchableOpacity>
          
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
        <ChatGhostingModal
          onSuccess = { this.ghostPartner }
          onCancel = { this.closeGhostingModal}
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
    marginVertical: 5
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
    marginVertical: 5
  },
});

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  ghostButtonStyle: {

  },
});
