import React from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import TouchableOpacityOnPress from '../../../../types/touchable-on-press';
import WonderImage from '../wonder-image';
import VideoPlayer from 'react-native-video-player';
import api, { ApiConfig } from '../../../../services/api';
import NavigatorService from 'src/services/navigation';
import Video from 'react-native-video';

interface Props {
  source?: string;
  featured?: boolean;
  onPress?: TouchableOpacityOnPress;
  size?: number;
  gutter: number;
  video?: boolean;
}

export default class MediaGridItem extends React.Component<Props> {

  state: any = {
    isActive: true
  }
  static defaultProps = {
    source: undefined,
    featured: false,
    size: 75,
    gutter: 0,
    video: false,
    isFocused: true
  };

  renderContainerStyles = () => {
    const { size, gutter } = this.props;
    return {
      width: size,
      height: size,
      margin: gutter
    };
  }


  renderMediaContent = () => {
    const { source, video } = this.props;
    if (source) {
      if (video) {
        return (
          <Video
            source={{ uri: `${ApiConfig.defaults.baseURL.replace('/v1', '')}${source}` }}
            style={{ width: '100%', height: '100%', zIndex:2}}
           
            controls={false}
          />
        );
      }
      return <WonderImage style={{ width: '100%', height: '100%', borderRadius: 10 }} uri={source} />;
    }
  }

  render() {
    const { source, onPress, size, video } = this.props;
    const containerStyles = [styles.container, this.renderContainerStyles()];

    if (!source) {
      return (
        <TouchableOpacity onPress={onPress}>
          <LinearGradient
            style={containerStyles}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={['#FFF799', '#FFC3A0']}
          >
            <Icon name={video ? 'video-camera' : 'plus'} size={size ? (size / 5) : 16} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity >
      );
    }
    if (source) {
      return (
        <TouchableOpacity onPress={onPress}>
          <View
            style={containerStyles}
          >
            {this.renderMediaContent()}
          </View>
        </TouchableOpacity >
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#DDD',
  }
});