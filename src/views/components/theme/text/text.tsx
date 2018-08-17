import React from 'react';
import { Text as NativeText, TextProps, StyleSheet } from 'react-native';
import Theme from '../../../../assets/styles/theme';

export interface Props extends TextProps {
  color?: string;
}

export default class Text extends React.Component<Props, any> {
  static defaultProps = {
    style: {},
    color: Theme.colors.textColor,
  }

  render() {
    const {
      children,
      style,
      color,
      ...rest
    } = this.props;

    return (
      <NativeText
        {...rest}
        style={[styles.text, { color }, style]}
      >
        {children}
      </NativeText>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: Theme.colors.textColor,
    fontFamily: Theme.fonts.primary
  }
})