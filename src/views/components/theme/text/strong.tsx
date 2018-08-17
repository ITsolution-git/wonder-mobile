import React from 'react';
import { StyleSheet } from 'react-native';
import Text, { Props } from './text';
import theme from '../../../../assets/styles/theme';

export default class Strong extends React.Component<Props> {
  render() {
    const { children, style, ...rest } = this.props;
    return (
      <Text style={[styles.text, style]} {...rest}>{children}</Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: theme.colors.primary
  }
});
