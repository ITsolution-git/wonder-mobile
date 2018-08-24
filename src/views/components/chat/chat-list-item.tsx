import React from 'react';
import { Text, Title, SmallText } from '../theme';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Avatar from 'src/views/components/theme/avatar';
import theme from 'src/assets/styles/theme';
import Conversation from 'src/models/conversation';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';

interface ChatListItemProps {
  chat: Conversation;
  onPress: TouchableOpacityOnPress;
}

class ChatListItem extends React.Component<ChatListItemProps> {
  static defaultProps = {
    chat: {
      messages: []
    }
  };

  renderRecentMessage = () => {
    const { chat } = this.props;
    if (chat && chat.last_message) {
      return <SmallText>{chat.last_message.body == null ? "" : chat.last_message.body}</SmallText>;
    }
    return <SmallText>No Messages</SmallText>;
  }

  render() {
    const { chat, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View flex={5}>
          <Avatar
            circle
            uri={(chat.partner.images && chat.partner.images.length) ? chat.partner.images[0].url : null}
          />
        </View>
        <View flex={10} style={styles.textContainer}>
          <Title style={{ color: '#000' }}>{chat.partner.first_name}</Title>
          {this.renderRecentMessage()}
        </View>
      </TouchableOpacity>
    );
  }
}

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textColor,
    padding: 15,
    flexDirection: 'row',
  },
  textContainer: {
    justifyContent: 'center'
  }
});
