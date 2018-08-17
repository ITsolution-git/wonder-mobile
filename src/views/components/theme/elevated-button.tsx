import React from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text } from '.';
import TouchableOpacityOnPress from '../../../types/touchable-on-press';
import LinearGradient from 'react-native-linear-gradient';
import GradientPoint from '../../../types/gradient-point';
import BaseButton, { BaseButtonProps } from './buttons/base-button';

interface Props extends BaseButtonProps {

}

export default class ElevatedButton extends React.Component<Props> {

  static defaultProps = {
    start: undefined
  };

  render() {
    const { onPress, title, style, start, ...rest } = this.props;
    return (
      <BaseButton
        title={title}
        onPress={onPress}
        start={start}
        colors={['#FEFEFE', '#FFF']}
        style={[styles.container, style]}
        {...rest}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 3,
    width: 'auto',
    padding: 10,
    elevation: 3,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 0,
      height: 5
    }
  }
});
