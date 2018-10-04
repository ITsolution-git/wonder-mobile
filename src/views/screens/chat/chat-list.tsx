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
import { Button, View, Text, StyleSheet } from "react-native";
import ChatActionButton from "src/views/components/chat/chat-action-button";
import SearchBar from "react-native-searchbar";

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  conversations: Conversation[];
  onRefreshConversations: () => void;
  onGetConversation: (partnerId: number) => void;
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
    dispatch(getConversation({ id: partnerId, successRoute: "Chat" }))
});

class ChatListScreen extends React.Component<Props> {
  searchBar?: any;
  state: ChatListScreenState = {
    isSearchModalOpen: false,
    results: [],
    handleChangeText: ""
  };

  componentWillMount() {
    const { conversations, onRefreshConversations } = this.props;
    this.props.onRefreshConversations();

    this.setState({ results: conversations });
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
          chats={this.state.results}
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
