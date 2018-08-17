import _ from 'lodash';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'src/views/components/theme';
import Topic from 'src/types/topic';
import theme from 'src/assets/styles/theme';
import TouchableOpacityOnPress from 'src/types/touchable-on-press';
import WonderImage from '../wonder-image';

interface Props {
  topic: Topic;
  selected?: boolean;
  onPress?: Function;
}

export default class WonderPickerItem extends React.Component<Props> {
  static defaultProps = {
    selected: false,
    onPress: _.noop
  };

  render() {
    const { topic, selected, onPress } = this.props;
    const renderedStyles = [styles.container];
    if (selected) {
      renderedStyles.push(styles.selectedContainer);
    }

    return (
      <View style={renderedStyles}>
        <TouchableOpacity style={styles.btn} onPress={() => onPress && onPress(topic)}>
          <WonderImage
            style={{ height: 30, width: 30, marginBottom: 5 }}
            uri={topic.icon}
          />
          <Text style={styles.label}>{_.toUpper(topic.name)}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 5,
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#FFF'
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.5,
  },
  btn: {
    borderRadius: 35,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 8
  }
});