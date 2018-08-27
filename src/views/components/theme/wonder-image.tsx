
import React from 'react';
import { ImageProps, Image, ImageBackground, ImageStyle, StyleProp } from "react-native";
import SvgUri from 'react-native-svg-uri';
import api, { ApiConfig } from 'src/services/api';
import Omit from 'src/models/omit';

interface Props extends Omit<ImageProps, "source"> {
  uri: string;
  background?: boolean;
  children?: any;
  style?: StyleProp<ImageStyle>;
}

class WonderImage extends React.Component<Props> {
  static defaultProps = {
    background: false
  };

  render() {
    const { uri, children, background, ...rest } = this.props;
    if (uri) {
      // Handle SVG images differently
      if (uri.endsWith('.svg')) {
        return (
          <SvgUri
            height={ rest.style.height }
            width={ rest.style.width }
            source={{ uri: `${ApiConfig.defaults.baseURL.replace('/v1', '/')}${uri}` }}
            {...rest}
          />
        );
      }

      if (background) {
        return (
          <ImageBackground {...rest} source={{ uri: `${ApiConfig.defaults.baseURL.replace('/v1', '/')}${uri}` }}>
            {children}
          </ImageBackground>
        );
      }
      return (
        <Image
          source={{ uri: `${ApiConfig.defaults.baseURL.replace('/v1', '/')}${uri}` }}
          {...rest}
        />
      );
    }
    return null;
  }
}

export default WonderImage;
