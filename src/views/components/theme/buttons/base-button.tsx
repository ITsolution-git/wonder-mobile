import React from 'react';
import {View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, Image, Dimensions} from 'react-native';
import { Text } from '..';
import theme from 'src/assets/styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import Color from 'color';
import LinearGradient from 'react-native-linear-gradient';
import GradientPoint from 'src/models/gradient-point';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const palette = Color(theme.colors.backgroundPrimary);

export interface BaseButtonProps {
  rounded?: boolean;
  icon?: string;
  color?: string;
  colors?: any;
  start?: GradientPoint;
  end?: GradientPoint;
  innerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  iconColor?: string;
  title: string;
  onPress: TouchableOpacityOnPress;
  disabled?: boolean;
  bold?: boolean;
}

export default class BaseButton extends React.Component<Partial<BaseButtonProps>, any> {
  static defaultProps = {
    rounded: false,
    iconColor: undefined,
    colors: [],
    start: undefined,
    end: undefined,
    fullWidth: false,
    color: undefined
  };

  renderIcon = () => {
    const { icon, color, iconColor } = this.props;
    if (icon) {
      return (
        <View style={styles.iconContainer}>
          <Icon name={icon} color={iconColor || color || palette.darken(0.2).toString()} size={14} />
        </View>
      );
    }
  }

  render() {
    const {
      rounded,
      disabled,
      style,
      innerStyle,
      start,
      end,
      color,
      colors,
      title,
      onPress,
      fullWidth,
      icon,
      bold,
      ...rest
    } = this.props;

    const renderedStyles: any = {};

    if (fullWidth) {
      renderedStyles.width = '100%';
    }

    if (rounded) {
      renderedStyles.borderRadius = 30;
    }

    let viewProps = {};
    let ViewContainer: any = View;
    if (colors.length) {
      ViewContainer = LinearGradient;
      viewProps = {
        start,
        end,
        colors
      };
    }

    return (

      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={[styles.container, renderedStyles, style]}
        {...rest}
      >
        <ViewContainer
          {...viewProps}
          style={[styles.btnContainer, renderedStyles, innerStyle]}
        >
          {icon && this.renderIcon()}
          <View style={styles.txtContainer}>
            <Text allowFontScaling={false} color={color} style={[styles.title, bold && { fontWeight: 'bold' }]}>{title}</Text>
          </View>
          {icon && <View flex={1} />}
        </ViewContainer>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btnContainer: {
    minWidth: 150,
    height: 55,
    // maxHeight: 60,
    // height: DEVICE_WIDTH * 0.15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 14
  },
  container: {
    // flex: 0,
  },
  txtContainer: {
    flex: 9,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    paddingHorizontal: 5,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    textAlign: 'center'
  }
});
