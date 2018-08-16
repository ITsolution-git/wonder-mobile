import React from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import TouchableOpacityOnPress from '../../../../types/touchable-on-press';

interface Props {
  source?: string;
  featured?: boolean;
  onPress?: TouchableOpacityOnPress;
  size?: number;
  gutter: number;
  video?: boolean;
  imgSrc: string;
}

export default class MediaGridItem extends React.Component<Props> {
  static defaultProps = {
    source: undefined,
    featured: false,
    size: 75,
    gutter: 0,
    video: false,
    imgSrc: undefined
  };

  renderContainerStyles = () => {
    const { size, gutter } = this.props;
    return {
      width: size,
      height: size,
      margin: gutter
    };
  }

  render() {
    const { source, onPress, size, video, imgSrc } = this.props;
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
            {/* <Image
              style={{ width: 180, height: 215 }}
              source={{ uri: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&h=350' }}
            /> */}
            {/* <Image
          style={{width: 66, height: 58}}
           source={{uri : "https://storage.googleapis.com/wonder-api-assets-storage/vhYitGCxns7tFM73UT1gdftk?GoogleAccessId=assets-wonder-cloud-storage%40wonder-210220.iam.gserviceaccount.com&Expires=1534429572&Signature=gltrF9YMCgM%2BPP4DO%2B7uINC%2FZ7xoc%2BQArpyM16hl0V9m94bVvCt2xq6No9yKxm18M%2Fc%2Fhb%2FEuggEygMo0nuM5yWdSHQyf6k55GF54q%2Ff%2B68K5061tIeu7oKC0gpx2vjZNWdTUAXSUg4BGG0JjFSyBLLdVZTYwZG34J39v5O%2FcMbKVneyvFMnT70pK%2FNLumuzmoT47AlyvcQ3UKuZWVocRidBiK6%2F9pLn0xI9mLbIb3iwbka2c%2BR%2FvV4DDI3Ozm5QNbrAYdr%2Ff6pgqA4FM4MoqRam5c%2FL3wX0Nx4TDYnYAvWSM4zQ9G8qQu49JUytLMXMLjcd5t6wxxe0t%2BJkEv7B4Q%3D%3D&response-content-disposition=inline%3B+filename%3D%22bike1.jpg%22%3B+filename%2A%3DUTF-8%27%27bike1.jpg&response-content-type=image%2Fjpeg"}} /> */}
            <Icon name={video ? 'video-camera' : 'plus'} size={size ? (size / 5) : 16} color="#FFF" />

          </LinearGradient>
        </TouchableOpacity >
      );
    }

    return (
      <View style={styles.container}>
      </View>
    )
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