import React from 'react';
import { Modal, View, ModalProps, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import theme from '../../../assets/styles/theme';
import { IconButton } from '../theme';
import TouchableOpacityOnPress from '../../../types/touchable-on-press';
import CameraData from '../../../types/camera-data';

interface Props extends ModalProps {
  direction?: 'front' | 'back';
  onCancel?: TouchableOpacityOnPress;
  openGalary?: TouchableOpacityOnPress;
  onSuccess?: Function;
}

class CameraModal extends React.Component<Props> {
  static defaultProps = {
    direction: 'front'
  };

  camera?: RNCamera | null;

  takePicture = async () => {
    const { onSuccess } = this.props;
    if (this.camera) {
      const options = { quality: 1 };
      const data: CameraData = await this.camera.takePictureAsync();
      if (onSuccess) {
        onSuccess(data);
      }
    }
  }

  render() {
    const { direction, onCancel, openGalary, onSuccess, onRequestClose, ...rest } = this.props;
    return (
      <Modal
        onRequestClose={onRequestClose}
        {...rest}
      >
        <View style={styles.container}>
          <RNCamera
            ref={(ref) => { this.camera = ref; }}
            style={styles.preview}
            type={RNCamera.Constants.Type.front}
            flashMode={RNCamera.Constants.FlashMode.auto}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
          />
          <View style={styles.footer}>
            <View style={styles.footerCol}>
              <IconButton icon="times" primary="#FFF" secondary="transparent" onPress={onCancel} />
            </View>
            <View style={styles.footerCol}>
              <IconButton circle icon="camera" onPress={this.takePicture} />
            </View>
            <View style={styles.footerCol}>
              <IconButton icon="image" primary="#FFF" secondary="transparent" onPress={openGalary} />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default CameraModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#DDD'
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
  },
  footer: {
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  footerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
