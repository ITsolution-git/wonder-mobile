import _ from 'lodash';
import React from 'react';
import { Text, Title, SmallText } from '../theme';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import Avatar from 'src/views/components/theme/avatar';
import theme from 'src/assets/styles/theme';
import Conversation from 'src/models/conversation';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';

import Icon from 'react-native-vector-icons/FontAwesome';

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
    const f = new Date();
    const d = new Date(chat.last_message.sent_at);
    // d.setHours(d.getHours() - f.getHours());
    const hours: number = Math.abs(f - d) / 36e5;

    if (chat && chat.last_message) {
      if (hours > 72) {
        return <SmallText style={{ color: 'red' }}>{_.get(chat, 'last_message.body', '') || ''}</SmallText>;
      }
      return <SmallText>{chat.last_message.body == null ? "" : chat.last_message.body}</SmallText>;
    }
    return <SmallText>No Messages</SmallText>;
  }

  renderGreenDot() {
    const { chat } = this.props;
    if (chat.partner.online) {
      return (
        <View style={{ marginLeft: 10 }}>
          <SmallText>
            <Icon name="circle" size={10} color="#48dc0e" />
          </SmallText>
        </View>
      );
    }
    return null;
  }
  renderDistance() {
    const { chat } = this.props;
    return (
      <View style={{ marginTop: 5 }}>
        <SmallText>
          {chat.partner.distance && _.get(chat, 'partner.distance', 0).toFixed(0)} miles
        </SmallText>
      </View>
    );
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    const { chat, onPress } = this.props;

    if (!chat.last_message) {
      return null;
    }
    return (

      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View flex={5}>
          <Avatar
            circle
            uri={(chat.partner.images && chat.partner.images.length) ? chat.partner.images[0].url : null}
          />
        </View>
        <View flex={10} style={styles.textContainer}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Title style={{ color: '#000' }}>{chat.partner.first_name} </Title>

            {this.renderGreenDot()}
          </View>
          {this.renderRecentMessage()}
          {this.renderDistance()}
        </View>
      </TouchableOpacity>
    );
  }
}

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6ec',
    padding: 15,
    flexDirection: 'row',
  },
  textContainer: {
    justifyContent: 'center'
  }
});
