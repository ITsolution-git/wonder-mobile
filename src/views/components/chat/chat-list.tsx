import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Title } from '../theme';
import { ChatListItem } from '.';
import Conversation from 'src/models/conversation';
import { deleteConversation } from 'src/store/sagas/conversations';
import { SwipeRow, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ChatListProps {
  onRefresh?: () => void;
  chats?: Conversation[];
  onPressChat: Function;
  currentUser: number;
}

class ChatList extends React.Component<ChatListProps> {
  static defaultProps = {
    chats: []
  };

  keyExtractor = (item: Conversation, index: number) => {
    return `${item.id}`;
  }

  renderItem = ({ item: chat }: { item: Conversation }) => {
    const { onPressChat, currentUser } = this.props;

    return (
      <ChatListItem
        currentUser={currentUser}
        chat={chat}
        onPress={() => onPressChat(chat)}

      />
    );
  }

  renderEmpty = () => {
    return (
      <View />
    );
  }

  render() {
    const { chats, onRefresh } = this.props;
    if (!chats || chats.length) {
      return (
        <FlatList
          refreshing={false}
          onRefresh={onRefresh}
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

// <SwipeRow
// style={{
//   borderBottomWidth: 1,
//   height: 90,
//   borderBottomColor: '#e6e6ec',
// }}
// rightOpenValue={-75}
// right={(
//   <Button danger onPress={() => console.log('delete')}>
//     <Icon name="trash" size={36} color="#FFF" />
//   </Button>
// )}
// body={<ChatListItem
//   currentUser={currentUser}
//   chat={chat}
//   onPress={() => onPressChat(chat)}
// />}
// />
// );
