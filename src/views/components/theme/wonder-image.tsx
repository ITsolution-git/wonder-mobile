
import React from 'react';
import { ImageProps, Image, ImageBackground } from "react-native";
import api, { ApiConfig } from '../../../services/api';
import Omit from '../../../types/omit';

interface Props extends Omit<ImageProps, "source"> {
  uri: string;
  background?: boolean;
  children?: any;
}

class WonderImage extends React.Component<Props> {
  static defaultProps = {
    background: false
  };

  render() {
    const { uri, children, background, ...rest } = this.props;
    if (uri) {

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
