import React from "react";
import Screen from "src/views/components/screen";
import { ChatList, LatestMatches } from "src/views/components/chat";
import { Title } from "src/views/components/theme";
import { NavigationScreenProp, NavigationParams } from "react-navigation";

import { Dispatch } from "redux";
import {
  getConversations,
  getConversation
} from "src/store/sagas/conversations";

import { persistNewReceivedMessage } from 'src/store/reducers/chat';

import { connect } from "react-redux";
import { selectCurrentUser } from "src/store/selectors/user";
import Conversation from "src/models/conversation";
import WonderAppState from "src/models/wonder-app-state";
import Chat from "src/models/chat";
import { View, StyleSheet, Alert } from "react-native";
import ChatActionButton from "src/views/components/chat/chat-action-button";
import SearchBar from "react-native-searchbar";
import { getAttendances } from "src/store/sagas/attendance";
import ActionCable from 'react-native-actioncable';
import { DOMAIN } from "src/services/api";

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  conversations: Conversation[];
  onRefreshConversations: () => void;
  onGetConversation: (partnerId: number) => void;
  onGetAttendances: () => void;
}

interface ChatListScreenState {
  isSearchModalOpen: boolean;
  results?: Conversation[];
  handleChangeText: string;
}

const mapState = (state: WonderAppState) => ({
  token: state.user.auth.token,
  currentUser: selectCurrentUser(state),
  conversations: state.chat.conversations,
  chat: state.chat
});

const mapDispatch = (dispatch: Dispatch) => ({
  onRefreshConversations: () => dispatch(getConversations()),
  onGetConversation: (partnerId: number) =>
    dispatch(getConversation({ id: partnerId, successRoute: "Chat" })),
  onGetAttendances: () => dispatch(getAttendances()),
  onReceiveMessage: (data) => dispatch(persistNewReceivedMessage(data))
});

class ChatListScreen extends React.Component<Props> {
  searchBar?: any;
  state: ChatListScreenState = {
    isSearchModalOpen: false,
    results: [],
    handleChangeText: ""
  };

  componentWillMount() {
    const { conversations, onRefreshConversations, token } = this.props;
    this.props.onRefreshConversations();
    this.props.onGetAttendances();

    this.appChat = {};
    this.cable = ActionCable.createConsumer(`wss://${DOMAIN}/cable?token=${token}`);
    this.appChat = this.cable.subscriptions.create({
      channel: "ConversationChannel",
    },
      {
        received: (data: any) => {
          if (data === `{"error":{"message":"Validation failed: Recipient must have already matched"}}`) {
            Alert.alert(
              'Sorry!',
              'This person has removed you from their conversations',
              [
                { text: 'OK' },
              ],
              { cancelable: false }
            );
          } else {
            this.props.onReceiveMessage(data);
          }

        },
        deliver: ({ message, recipient_id }) => {
          this.appChat.perform('deliver', { body: message, recipient_id });
        }
      });
  }

  componentDidUpdate(prevProps: any) {
    const { chat } = this.props;
    if (chat.newOutgoingMessage.hasOwnProperty('message')) {
      if (
        chat.newOutgoingMessage.message !== prevProps.chat.newOutgoingMessage.message) {

        this.appChat.deliver(
          {
            message: chat.newOutgoingMessage.message.text,
            recipient_id: chat.newOutgoingMessage.recipient_id
          });
      }
    }
    if (chat.lastReadMessage && chat.lastReadMessage !== prevProps.chat.lastReadMessage) {
      if (chat.lastReadMessage.last_message && chat.lastReadMessage.last_message.aasm_state !== "read") {
        this.appChat.perform('read', { message_id: chat.lastReadMessage.last_message.id });
      }
    }
    if (chat.ghostMessage && chat.ghostMessage !== prevProps.chat.ghostMessage) {
      this.appChat.deliver(
        {
          message: chat.ghostMessage.ghostMessage,
          recipient_id: chat.ghostMessage.partner.id
        });
    }
  }

  goToChat = (chat: Chat) => {
    const { navigation, onGetConversation } = this.props;
    onGetConversation(chat.partner.id);
  }

  openSearchModal = () => {
    this.setState({ isSearchModalOpen: !this.state.isSearchModalOpen });
  }

  handleResults = (results: Conversation[]) => {
    const { conversations, onRefreshConversations } = this.props;
    if (!results.length && !this.state.handleChangeText) {
      this.setState({ results: conversations });
    } else {
      this.setState({ results });
    }
  }

  handleChangeText = (text: string) => {
    this.setState({ handleChangeText: text });
  }

  renderSearchbar = () => {

    const { conversations, onRefreshConversations } = this.props;
    if (this.state.isSearchModalOpen) {
      return (
        <SearchBar
          ref={(ref: any) => this.searchBar = ref}
          data={conversations}
          onBack={this.openSearchModal}
          handleResults={this.handleResults}
          handleChangeText={this.handleChangeText}
          showOnLoad
        />
      );
    }
  }

  renderSearchButton() {
    const { conversations, onRefreshConversations } = this.props;
    if (conversations.length) {
      return (
        <View style={{ width: "50%" }} flexDirection={"row"}>
          <ChatActionButton
            title="Search"
            onPress={this.openSearchModal}
          />
        </View>
      );
    }
    return null;
  }

  render() {
    const { conversations, onRefreshConversations, currentUser } = this.props;

    return (
      <Screen horizontalPadding={20}>
        {this.renderSearchbar()}
        <Title>Latest Matches</Title>
        <View>
          <LatestMatches
            onRefresh={onRefreshConversations}
            chats={conversations}
            onPressChat={this.goToChat}
          />
        </View>
        <ChatList
          currentUser={currentUser}
          onRefresh={onRefreshConversations}
          chats={this.props.conversations}
          onPressChat={this.goToChat}
        />

        <View
          style={styles.searchButtonContainer}
        >
          {this.renderSearchButton()}
        </View>

      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(ChatListScreen);

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
  },
  searchButtonContainer: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center"
  }
});
