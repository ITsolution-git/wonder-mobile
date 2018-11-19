// author: NK

import * as React from "react";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { colors } from "@assets";

const localStyles = StyleSheet.create({
  container: {
    borderRadius: 5,
    shadowColor: colors.lightPurple,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 2,
    shadowRadius: 3,
    shadowOpacity: 0.3,
  },
});

interface ISwitchProps {
  value?: boolean;
  disabled?: boolean;
  onValueChange?: (data?: any) => any;
  height?: number;
  width?: number;
  trackHeight?: number;
  trackColor?: string;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  switchStyle?: ViewStyle;
  activeSwitchColor?: string;
  inactiveSwitchColor?: string;
}

export default class Switch extends React.PureComponent<ISwitchProps> {
  static defaultProps = {
    trackHeight: 2,
    trackColor: colors.lightGray,
    activeSwitchColor: colors.lightPeach,
    inactiveSwitchColor: colors.iron,
    height: 10,
    width: 30,
    switchStyle: localStyles.container,
    disabled: false,
    value: false,
  };

  private isActive = (): boolean => !!this.props.value;

  private getContainerStyle = (): ViewStyle => {
    const {
      width,
      trackHeight,
      activeTrackColor,
      inactiveTrackColor,
      trackColor,
    } = this.props;

    return {
      justifyContent: "center",
      width: width * 2,
      height: trackHeight,
      backgroundColor: this.isActive()
        ? activeTrackColor || trackColor
        : inactiveTrackColor || trackColor,
    };
  };

  private getSwitchStyle = (): ViewStyle => {
    const {
      width,
      height,
      switchStyle,
      activeSwitchColor,
      inactiveSwitchColor,
    } = this.props;
    const translateX = this.isActive() ? width : 0;
    const backgroundColor = this.isActive()
      ? activeSwitchColor
      : inactiveSwitchColor;

    return {
      width,
      height,
      transform: [{ translateX }],
      backgroundColor,
      ...switchStyle,
    };
  };

  private localOnValueChange = (): void => {
    const { onValueChange } = this.props;

    console.log("local on value change. value is currently:", this.props.value);

    if (onValueChange) {
      onValueChange();
    }
  };

  render() {
    const { onValueChange, disabled } = this.props;

    return (
      <View style={this.getContainerStyle()}>
        <TouchableWithoutFeedback
          disabled={disabled}
          onPress={this.localOnValueChange}
        >
          <Animatable.View
            transition={["translateX", "backgroundColor"]}
            style={this.getSwitchStyle()}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
