import React from 'react';
import { View, StyleSheet, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import { WonderImage } from '../theme';
import Icon from 'react-native-vector-icons/FontAwesome';

export enum AvatarSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

interface AvatarProps {
  bordered?: boolean;
  rounded?: boolean;
  circle?: boolean;
  uri?: string | null;
  size?: AvatarSize | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ImageStyle>;
}

class Avatar extends React.Component<AvatarProps> {
  static defaultProps = {
    size: AvatarSize.sm,
    bordered: false,
    rounded: false,
    circle: false,
    uri: null
  };

  static Sizes = {
    xs: 32,
    sm: 64,
    md: 96,
    lg: 128,
    xl: 160
  };

  getDimensions = () => {
    const { size } = this.props;
    return Avatar.Sizes[size || AvatarSize.sm];
  }

  getContainerStyles = () => {
    const { bordered, rounded, circle } = this.props;
    const length = this.getDimensions();
    return {
      height: length,
      width: length,
      borderRadius: circle ? (length / 2) : (rounded ? 5 : 0),
      borderWidth: bordered ? 3 : 0
    };
  }

  renderImage = () => {
    const { uri, style } = this.props;
    if (uri) {
      console.log('URI: ', `${uri}?w=100&h=100&auto=enhance,format&fit=crop&crop=entropy&q=60`);
      return (
        <WonderImage
          style={[{
            ...this.getContainerStyles(),
            width: this.getDimensions(),
            height: this.getDimensions(),

          }, style]}
          uri={`${uri}`}
        />
      );
    }

    return (
      <Icon
        color="#BBB"
        name="user"
        size={this.getDimensions() * 0.4}
      />
    );
  }

  render() {
    const { uri, containerStyle } = this.props;
    return (
      <View style={[styles.avatarContainer, this.getContainerStyles(), containerStyle]}>
        {this.renderImage()}
      </View>
    );
  }
}

export default Avatar;

const styles = StyleSheet.create({
  avatarContainer: {
    borderColor: '#FFF',
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowColor: '#000',
    shadowOpacity: 0.3
  }
});
