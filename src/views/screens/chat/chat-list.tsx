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

import { connect } from "react-redux";
import { selectCurrentUser } from "src/store/selectors/user";
import Conversation from "src/models/conversation";
import WonderAppState from "src/models/wonder-app-state";
import Chat from "src/models/chat";
import { View, StyleSheet } from "react-native";
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
  currentUser: selectCurrentUser(state),
  conversations: state.chat.conversations
});

const mapDispatch = (dispatch: Dispatch) => ({
  onRefreshConversations: () => dispatch(getConversations()),
  onGetConversation: (partnerId: number) =>
    dispatch(getConversation({ id: partnerId, successRoute: "Chat" })),
  onGetAttendances: () => dispatch(getAttendances())
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
    // this should be from redux directly
    // this.setState({ results: conversations });
    this.appChat = {};
    this.cable = ActionCable.createConsumer(`wss://${DOMAIN}/cable?token=${token}`);
    this.appChat = this.cable.subscriptions.create({
      channel: "ConversationChannel",
    },
      {

        received: (data: any) => {
          console.log('received: ', data);
        },
        deliver: (message: string) => {
          // console.log('deliver: ', message);
          this.appChat.perform('deliver', { body: 'SOCKET TEST', recipient_id: 848 });
        }
      });
  }

  componentDidMount() {
    setTimeout(() => {
      this.appChat.deliver();
    }, 3000);

    // johanns id id: 848
    // current user id: 743
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
    const { conversations, onRefreshConversations } = this.props;
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

// this.appChat = {};
// this.cable = ActionCable.createConsumer(`wss://${DOMAIN}/cable?token=${token}`);
// this.appChat = this.cable.subscriptions.create({
//   channel: "ConversationChannel",
// },
//   {

//     received: (data: any) => {
//       const { onGetMessage } = this.props;
//       const receivedMessage: GiftedChatMessage = {
//         _id: data.id,
//         text: data.body,
//         createdAt: data.sent_at,
//         user: {
//           _id: data.sender.id,
//           name: data.sender.first_name,
//           avatar: `${data.sender.images[0].url}${avatarExtension}`
//         }
//       };
//       onGetMessage(conversation.partner.id);
//       this.setState({ conversationMessages: [receivedMessage, ...this.state.conversationMessages] });
//       // onGetMessage(conversation.partner.id);  // What does this even do?
//     },
//     deliver: (message: string) => {
//       this.appChat.perform('deliver', { body: message, recipient_id: conversation.partner.id });
//     }
//   });

// this.appChat.perform('deliver', { body: message, recipient_id: conversation.partner.id });
