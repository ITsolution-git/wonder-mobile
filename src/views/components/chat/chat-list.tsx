import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Title } from '../theme';
import { ChatListItem } from '.';
import Chat from '../../../types/chat';
import TouchableOpacityOnPress from '../../../types/touchable-on-press';
import Conversation from '../../../types/conversation';

interface ChatListProps {
  chats?: Conversation[];
  onPressChat: Function;
}

class ChatList extends React.Component<ChatListProps> {
  static defaultProps = {
    chats: []
  };

  keyExtractor = (item: Conversation, index: number) => {
    return `${item.partner.id}`;
  }

  renderItem = ({ item: chat }: { item: Conversation }) => {
    const { onPressChat } = this.props;
    return (
      <ChatListItem
        chat={chat}
        onPress={() => onPressChat(chat)}
      />
    );
  };

  renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Title>No Chats</Title>
      </View>
    );
  }

  render() {
    const { chats } = this.props;
    if (!chats || chats.length) {
      return (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={chats || []}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      );
    }
    return this.renderEmpty();
  }
}

export default ChatList;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1
  }
});
