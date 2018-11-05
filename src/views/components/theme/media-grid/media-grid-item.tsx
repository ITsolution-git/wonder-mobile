import React from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import WonderImage from '../wonder-image';
import api, { ApiConfig, BASE_URL } from 'src/services/api';
import Video from 'react-native-video';
import { Response } from 'src/models/image-picker';
import ProfileImage from 'src/models/profile-image';

interface Props {
  videoSource?: string;
  source?: ProfileImage;
  featured?: boolean;
  onPress: (data: Response | null) => void;
  size?: number;
  gutter: number;
  video?: boolean;
}

export default class MediaGridItem extends React.Component<Props> {

  state: any = {
    isActive: true
  };

  static defaultProps = {
    videoSource: undefined,
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
    const { source, videoSource, video } = this.props;
    if (video && videoSource) {
      return (
        <Video
          paused
          source={{ uri: `${videoSource}` }}
          style={{ width: '100%', height: '100%', zIndex: 2 }}
          controls={false}
        />
      );
    } else if (source) {
      return <WonderImage style={{ width: '100%', height: '100%', borderRadius: 10 }} uri={source.url} />;
    }
    return null;
  }

  onPress = () => {
    const { source, videoSource, onPress } = this.props;

    if (source) {
      onPress({ ...source, uri: `${BASE_URL}/${source.url}` });
    } else if (videoSource) {
      onPress({ uri: `${BASE_URL}/${videoSource}` });
    }
  }

  render() {
    const { source, onPress, size, video, videoSource } = this.props;
    const containerStyles = [styles.container, this.renderContainerStyles()];

    if (!source && !videoSource) {
      return (
        <TouchableOpacity onPress={() => onPress(null)}>
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
    return (
      <TouchableOpacity onPress={this.onPress}>
        <LinearGradient
          style={containerStyles}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={['#FFF799', '#FFC3A0']}
        >
          {this.renderMediaContent()}
        </LinearGradient>
      </TouchableOpacity >
    );
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
