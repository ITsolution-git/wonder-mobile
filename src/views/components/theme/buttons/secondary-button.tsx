import React from 'react';
import BaseButton, { BaseButtonProps } from './base-button';
import theme from '../../../../assets/styles/theme';
import Color from 'color';

const palette = Color(theme.colors.backgroundPrimary);
export default class OutlineButton extends React.Component<BaseButtonProps> {
  render() {
    const { disabled } = this.props;
    return (
      <BaseButton
        disabled={disabled}
        rounded
        color={theme.colors.textColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        innerStyle={{ backgroundColor: palette.toString(), padding: 15 }}
        {...this.props}
      />
    );
  }
}
