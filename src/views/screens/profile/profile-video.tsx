import React from 'react';
import { RNCamera } from 'react-native-camera';
import Screen from '../../components/screen';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../components/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../../../assets/styles/theme';

class ProfileVideoScreen extends React.Component {
  camera?: RNCamera | null;

  takeVideo = () => {
    if (this.camera) {
      const options = { maxDuration:60, base64: true };
      this.camera.recordAsync(options).then(data => {
        console.log(data.uri);
      })
    }
  };

  render() {
    return (
      <Screen>
        <RNCamera 
          ref={ref => { this.camera = ref; }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={this.takeVideo}
            style={styles.capture}
          >
            <Icon name="camera" color="#FFF" size={24} />
          </TouchableOpacity>
        </View>
      </Screen>
    )
  }
}

export default ProfileVideoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    backgroundColor: theme.colors.primary,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    height: 50,
    width: 50,
    alignSelf: 'center',
    margin: 20
  }
});