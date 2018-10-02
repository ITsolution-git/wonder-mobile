import React from 'react';
import { Text, Title, SmallText } from '../theme';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Avatar from 'src/views/components/theme/avatar';
import theme from 'src/assets/styles/theme';
import Conversation from 'src/models/conversation';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';

interface LatestMatchesItemProps {
  chat: Conversation;
  onPress: TouchableOpacityOnPress;
}

class LatestMatchesItem extends React.Component<LatestMatchesItemProps> {
  static defaultProps = {
    chat: {
      messages: []
    }
  };



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
      </TouchableOpacity>
    );
  }
}

export default LatestMatchesItem;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  textContainer: {
    justifyContent: 'center'
  }
});

