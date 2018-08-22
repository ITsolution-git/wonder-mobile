import React from 'react';
import Screen from 'src/views/components/screen';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Text, PrimaryButton, TextButton } from 'src/views/components/theme';
import theme from 'src/assets/styles/theme';
import CameraModal from 'src/views/components/modals/camera-modal';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import CameraData from 'src/types/camera-data';
import { updateImage } from 'src/store/sagas/user';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ImagePicker from 'react-native-image-picker';
import ImageRotate from 'react-native-image-rotate';

const mapDispatch = (dispatch: Dispatch) => ({
  onUpdateImage: (data: any) => dispatch(updateImage(data))
});

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  onUpdateImage: Function;
}

interface State {
  modalOpen: boolean;
  imageData: CameraData | null;
}

class ProfileCameraScreen extends React.Component<Props, State> {
  state: State = {
    imageData: null,
    modalOpen: false,
  };

  openModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });

  onImageTaken = (data: CameraData) => this.setState({ imageData: data }, this.closeModal);

  clear = () => this.setState({ imageData: null });
  save = () => {
    const { onUpdateImage, navigation } = this.props;
    const { imageData } = this.state;
    onUpdateImage(imageData);
    navigation.goBack();
  }

  saveOne = () => {
    const { onUpdateImage, navigation } = this.props;
    const { imageData } = this.state;
    onUpdateImage(imageData);
    navigation.goBack();
  }

  pickImageHandler = () => {
    ImagePicker.launchImageLibrary({ title: "Pick an Image" }, (res) => {
      if (res.didCancel) {
        // console.log("User cancelled!");
      } else if (res.error) {
        // console.log("Error", res.error);
      } else {
        this.setState({ imageData: res }, this.closeModal);
      }
    });
  }

  rotate = () => {
    const { imageData } = this.state;
    if (imageData !== null) {
      ImageRotate.rotateImage(
        imageData.uri,
        90,
        (uri: string) => {
          this.setState({
            imageData: {
              ...imageData,
              uri
            }
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }

  }

  renderContent = () => {
    const { imageData, modalOpen } = this.state;
    if (imageData) {
      return (
        <View flex={1} >
          <View style={[styles.imgcontainer, { padding: 0 }]}>
            <Image
              source={{ uri: imageData.uri }}
              style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
            />
          </View>
          <View style={styles.footer}>
            <View style={styles.footerCol}>
              <PrimaryButton
                fullWidth
                rounded={false}
                title="ROTATE"
                onPress={this.rotate}
              />
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.footerCol}>
              <TextButton
                text="DELETE"
                onPress={this.clear}
              />
            </View>
            <View style={styles.footerCol}>
              <PrimaryButton
                rounded={false}
                title="RETAKE"
                onPress={this.openModal}
              />
            </View>
            <View style={styles.footerCol}>
              <TextButton
                text="SAVE"
                onPress={this.save}
              />
            </View>
          </View>

        </View>
      );
    }
    if (imageData) {
      return (
        <View flex={1} >
          <View style={[styles.container, { padding: 0 }]}>
            <Image
              source={{ uri: imageData.uri }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      );
    }
    return (
      <View flex={1}>
        <View style={styles.container}>
          <Text>
            Take a selfie to express who you are.
            Your profile images are displayed for other
            people who match your interests
        </Text>
        </View>
        <PrimaryButton
          rounded={false}
          title="Open Camera"
          onPress={this.openModal}
        />
      </View>
    );
  }
  render() {
    const { navigation } = this.props;
    const { modalOpen } = this.state;
    return (
      <Screen>
        {this.renderContent()}
        <CameraModal
          onRequestClose={this.closeModal}
          onSuccess={this.onImageTaken}
          animationType="slide"
          transparent={false}
          onCancel={this.closeModal}
          openGallery={this.pickImageHandler}
          direction="front"
          visible={modalOpen}
        />
      </Screen>
    );
  }
}

export default connect(null, mapDispatch)(ProfileCameraScreen);
// export default ProfileCameraScreen;

const styles = StyleSheet.create({
  imgcontainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 20
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 20
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  footerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
