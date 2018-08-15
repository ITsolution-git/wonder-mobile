import React from 'react';
import { StyleSheet } from 'react-native';
import Text, { Props } from './text';

export default class Title extends React.Component<Props> {
  render() {
    const { children, style, ...rest } = this.props;
    return (
      <Text style={[styles.text, style]} {...rest}>{children}</Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16
  }
});
