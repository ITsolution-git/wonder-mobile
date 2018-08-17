import React from 'react';
import { View, StyleSheet, TextInput as Input, TouchableOpacity, StyleProp } from 'react-native';
import { Text } from '..';
import theme from '../../../../assets/styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import Color from 'color';
import LinearGradient from 'react-native-linear-gradient';
import GradientPoint from '../../../../types/gradient-point';
import TouchableOpacityOnPress from '../../../../types/touchable-on-press';

const palette = Color(theme.colors.backgroundPrimary);

export interface BaseButtonProps {
  rounded?: boolean;
  icon?: string;
  color?: string;
  colors?: any;
  start?: GradientPoint;
  end?: GradientPoint;
  style?: StyleProp<any>;
  fullWidth?: boolean;
  iconColor?: string;
  title: string;
  onPress: TouchableOpacityOnPress;
  disabled?: boolean;
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
      start,
      end,
      color,
      colors,
      title,
      onPress,
      fullWidth,
      icon,
      ...rest
    } = this.props;

    const renderedStyles: any = {};

    if (fullWidth) {
      renderedStyles['width'] = '100%';
    } else {
      renderedStyles['width'] = 'auto';
    }

    if (rounded) {
      renderedStyles['borderRadius'] = 30;
    }

    if (colors.length) {
      return (
        <LinearGradient
          start={start}
          end={end}
          colors={colors}
          style={[styles.btnContainer, renderedStyles]}
        >
          <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={[styles.container, renderedStyles, style]}
            {...rest}
          >
            {icon && this.renderIcon()}
            <View style={styles.txtContainer}>
              <Text color={color} style={styles.title}>{title}</Text>
            </View>
            {icon && <View flex={1} />}
          </TouchableOpacity>
        </LinearGradient>
      );
    }

    return (
      <View style={[styles.btnContainer, renderedStyles]}>
        <TouchableOpacity
          disabled={disabled}
          onPress={onPress}
          style={[styles.container, renderedStyles, style]}
          {...rest}
        >
          {icon && this.renderIcon()}
          <View style={styles.txtContainer}>
            <Text color={color} style={styles.title}>{title}</Text>
          </View>
          {icon && <View flex={1} />}
        </TouchableOpacity>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  btnContainer: {
    elevation: 1,
    flex: 0,
    // backgroundColor: palette.toString(),
  },
  container: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  txtContainer: {
    flex: 7,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    textAlign: 'center'
  }
});
