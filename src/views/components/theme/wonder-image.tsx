import _ from "lodash";
import React from "react";
import {
  ImageProps,
  Image,
  ImageBackground,
  ImageStyle,
  StyleProp,
  Dimensions
} from "react-native";
import SvgUri from "react-native-svg-uri";
import api, { BASE_URL } from "src/services/api";
import Omit from "src/models/omit";

const backgroundImageExtension = '?w=600&h=1200&auto=enhance,format&fit=crop&crop=entropy&q=60';
const avatarImageExtension = '?w=200&h=200&auto=enhance,format&fit=crop&crop=entropy&q=60';

// const imageDimensions = `?w=${}&h=${}&auto=enhance,format&fit=crop&crop=entropy&q=60`

interface Props extends Omit<ImageProps, "source"> {
  uri: string;
  background?: boolean;
  children?: any;
  style?: StyleProp<ImageStyle>;
}

class WonderImage extends React.PureComponent<Props> {
  static defaultProps = {
    background: false
  };

  render() {
    const { uri, children, background, style, ...rest } = this.props;

    if (uri) {
      // Handle SVG images differently
      if (uri.toString().endsWith(".svg")) {
        return (
          <SvgUri
            height={_.get(style, "height", 15)}
            width={_.get(style, "width", 15)}
            source={{ uri: `${BASE_URL}/${uri}` }}
            {...rest}
          />
        );
      }

      if (background) {

        return (
          <ImageBackground
            style={style}
            {...rest}
            source={{ uri: `${uri}?w=${style.width}&h=${style.height}&auto=enhance,format&fit=crop&crop=entropy&q=60` }}
          >
            {children}
          </ImageBackground>
        );
      }
      console.log('image: ', style);
      return (
        <Image
          style={style}
          source={{ uri: `${uri}?w=${400}&h=${400}&auto=enhance,format&fit=crop&crop=entropy&q=60` }}
          {...rest}
        />
      );
    }
    return null;
  }
}

export default WonderImage;
// ?w=300&max-h=1200&fit=crop

// ?w=${style.width ? style.width : 300}&auto=compress&fit=crop&auto=enhance

// `${uri}?auto=format&lossless=1`
