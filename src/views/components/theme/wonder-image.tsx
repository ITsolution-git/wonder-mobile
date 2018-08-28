import _ from 'lodash';
import React from 'react';
import { ImageProps, Image, ImageBackground, ImageStyle, StyleProp } from "react-native";
import SvgUri from 'react-native-svg-uri';
import api, { BASE_URL } from 'src/services/api';
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
    const { uri, children, background, style, ...rest } = this.props;
    if (uri) {
      // Handle SVG images differently
      if (uri.endsWith('.svg')) {
        return (
          <SvgUri
            height={_.get(style, 'height', 15)}
            width={_.get(style, 'width', 15)}
            source={{ uri: `${BASE_URL}/${uri}` }}
            {...rest}
          />
        );
      }

      if (background) {
        return (
          <ImageBackground style={style} {...rest} source={{ uri: `${BASE_URL}/${uri}` }}>
            {children}
          </ImageBackground>
        );
      }
      return (
        <Image
          style={style}
          source={{ uri: `${BASE_URL}/${uri}` }}
          {...rest}
        />
      );
    }
    return null;
  }
}

export default WonderImage;
