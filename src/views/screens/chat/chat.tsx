import React from "react";
import _ from 'lodash';
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import ActionCable from 'react-native-actioncable';
import Screen from "src/views/components/screen";
import theme from "src/assets/styles/theme";
import { View, StyleSheet, TouchableOpacity, Image, Alert, Text } from "react-native";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import ChatActionButton from "src/views/components/chat/chat-action-button";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  getConversation,
  sendMessage,
  ghostContact
} from "src/store/sagas/conversations";
import { getDecoratedConversation } from "src/store/selectors/conversation";
import { selectCurrentUser } from "src/store/selectors/user";
import User from "src/models/user";
import {
  DecoratedConversation,
  ConversationNewMessage
} from "src/models/conversation";
import GiftedChatMessage from "src/models/chat-message";
import ChatGhostingModal from "../../components/modals/chat-ghosting-modal";
import WonderAppState from "src/models/wonder-app-state";
import ChatResponseMessage from "src/models/chat-response-message";
import {
  AppointmentState,
  persistAppointmentData
} from "src/store/reducers/appointment";
import Assets from "src/assets/images";
import { DOMAIN } from "src/services/api";

import ImagePicker from 'react-native-image-picker';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import { Options, Response } from "../../../models/image-picker";
import { ImageSource } from "react-native-vector-icons/Icon";

interface DispatchProps {
  onGetMessage: (userId: number) => void;
  onSendMessage: (chatMessage: ConversationNewMessage) => void;
  onUpdateAppointment: (data: AppointmentState) => void;
  onGhostContact: (data: User) => void;
}

interface StateProps {
  currentUser: User;
  token: string | null;
  conversation: DecoratedConversation;
}

interface Props extends DispatchProps, StateProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

interface ChatViewState {
  isGhostingModalOpen: boolean;
  selectedSendImage: ImageSource;
  conversationMessages: GiftedChatMessage[];
}

const mapState = (state: WonderAppState): StateProps => ({
  token: state.user.auth.token,
  currentUser: selectCurrentUser(state),
  conversation: getDecoratedConversation(state),
});

const mapDispatch = (dispatch: Dispatch): DispatchProps => ({
  onGetMessage: (userId: number) => dispatch(getConversation({ id: userId })),
  onSendMessage: (data: any) => dispatch(sendMessage(data)),
  onUpdateAppointment: (data: AppointmentState) =>
    dispatch(persistAppointmentData(data)),
  onGhostContact: (data: User) => dispatch(ghostContact(data))
});

class ChatScreen extends React.Component<Props> {
  cable: any;
  appChat: any;

  static navigationOptions = ({
    navigation
  }: {
      navigation: NavigationScreenProp<any, NavigationParams>;
    }) => ({
      title: navigation.getParam('title', 'Chat'),
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <Menu>
            <MenuTrigger>
              <View style={{ justifyContent: 'center', alignItems: 'center', width: 40 }}>
                <Icon name="ellipsis-v" size={20} color="#9292ad" />
              </View>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => Alert.alert('Profile')} >
                <Text style={{ fontSize: 16 }}>View profile</Text>
              </MenuOption>
              <MenuOption onSelect={() => Alert.alert('Block and report')} >
                <Text style={{ fontSize: 16, color: 'red' }}>Block and report</Text>
              </MenuOption>

              <MenuOption onSelect={() => Alert.alert('Unmatch')} >
                <Text style={{ fontSize: 16, color: 'red' }}>Unmatch</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      )

    })

  state: ChatViewState = {
    isGhostingModalOpen: false,
    selectedSendImage: '',
    conversationMessages: []
  };

  componentWillMount() {
    const { conversation, token, navigation } = this.props;
    navigation.setParams({ title: conversation.partner.first_name + ' ' + conversation.partner.last_name });
    this.appChat = {};
    this.cable = ActionCable.createConsumer(`wss://${DOMAIN}/cable?token=${token}`);
    this.appChat = this.cable.subscriptions.create({
      channel: "ConversationChannel",
      recipient_id: conversation.partner.id
    },
      {
        received: (data: any) => {
          console.log('got it: ', data);
          const { onGetMessage } = this.props;
          const receivedMessage: GiftedChatMessage = {
            _id: data.id,
            text: data.body,
            createdAt: data.sent_at,
            user: {
              _id: data.sender.id,
              name: data.sender.first_name,
            }
          };
          onGetMessage(conversation.partner.id);
          this.setState({ conversationMessages: [receivedMessage, ...this.state.conversationMessages] });
          // onGetMessage(conversation.partner.id);  // What does this even do?
        },
        deliver: (message: string) => {
          console.log('send');
          this.appChat.perform('deliver', { body: message, recipient_id: conversation.partner.id });
        }
      });
  }

  componentDidMount() {

    // const stuff = getDecoratedConversation(this.props.conversation);
    // this.setState({ conversationMessages: stuff });
  }

  componentWillUnmount() {
    if (this.appChat) {
      this.cable.subscriptions.remove(this.appChat);
    }
  }

  scheduleWonder = () => {
    const { navigation, conversation, onUpdateAppointment } = this.props;
    onUpdateAppointment({ match: conversation.partner });
    navigation.navigate("WonderMap", { id: conversation.partner.id });
  }

  ghostPartner = (ghostMessage: string) => {
    const { navigation, onGhostContact, conversation } = this.props;

    this.appChat.deliver(ghostMessage); //  Send the message
    onGhostContact(conversation.partner);
    this.closeGhostingModal();
    navigation.navigate("ChatList");
  }
  openGhostingModal = () => {
    this.setState({ isGhostingModalOpen: true });
  }

  closeGhostingModal = () => {
    this.setState({ isGhostingModalOpen: false });
  }

  onSend = (messages: ChatResponseMessage[] = []) => {
    messages.forEach((message: ChatResponseMessage) => {
      this.appChat.deliver(message.text);
    });

    this.setState({ selectedSendImage: '' });
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

  renderSend = (props: any) => {
    return (
      <Send
        {...props}
      >
        <View style={{ marginRight: 12, marginBottom: 15 }}>
          <Icon name="paper-plane" size={20} color="#9292ad" />
        </View>
      </Send>
    );
  }

  renderActions = (props: any) => {
    return (
      <TouchableOpacity onPress={this.getImage}>
        <View style={{ marginLeft: 12, marginBottom: 15 }}>
          <Icon name="plus" size={20} color="#9292ad" />
        </View>
      </TouchableOpacity>
    );
  }

  getImage = () => {
    const options: Options = {
      title: 'Upload a Photo',
      mediaType: 'photo'
    };

    ImagePicker.showImagePicker(options, (res: Response) => {
      if (res.didCancel) {
        // console.log("User cancelled!");
      } else if (res.error) {
        // console.log("Error", res.error);
      } else {
        const source = { uri: res.uri.replace('file://', '') };
        this.setState({ selectedSendImage: source });
      }
    });
  }

  renderFooter = () => {
    // if (!this.state.selectedSendImage) {
    //   return (
    //     <View
    //       style={{
    //         marginBottom: 10,
    //         flexDirection: "row",
    //         justifyContent: "center"
    //       }}
    //     >
    //       <Image
    //         style={{ width: 100, height: 100 }}
    //         source={this.state.selectedSendImage}
    //       />
    //     </View>
    //   );
    // }
    return (
      <View
        style={{
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <View style={{ width: "50%" }} flexDirection={"row"}>
          <ChatActionButton
            title="Schedule Wonder"
            onPress={this.scheduleWonder}
          />
          <TouchableOpacity
            onPress={this.openGhostingModal}
            style={styles.ghostButtonStyle}
          >
            <Image
              source={Assets.GhostButton}
              style={{ width: 28, height: 32 }}
            />
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
          renderSend={this.renderSend}
          renderBubble={this.renderBubble}
          messages={this.state.conversationMessages}
          renderFooter={this.renderFooter}
          onSend={this.onSend}
          renderActions={this.renderActions}

        />
        <ChatGhostingModal
          visible={this.state.isGhostingModalOpen}
          onSuccess={this.ghostPartner}
          onCancel={this.closeGhostingModal}
        />
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(ChatScreen);

const bubbleTextStyle = StyleSheet.create({
  right: {
    color: "#FFF",
    fontWeight: "bold"
  },
  left: {
    color: "#000",
    fontWeight: "bold"
  }
});

const bubbleWrapperStyle = StyleSheet.create({
  right: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "blue",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: 3,
      height: 1
    },
    backgroundColor: '#fcb26a',
    marginVertical: 5
  },
  left: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: -3,
      height: 1
    },
    backgroundColor: "#FFF",
    marginVertical: 5
  }
});

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  ghostButtonStyle: {
    marginLeft: 20,
    marginTop: 2,
    borderRadius: 100 / 2,
    justifyContent: "center",
    alignItems: "center",
    width: 46,
    height: 46,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#fcbd77"
  }
});
