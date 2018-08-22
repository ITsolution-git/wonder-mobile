import React from 'react';
import { RNCamera } from 'react-native-camera';
import Screen from '../../components/screen';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Text,TextButton,PrimaryButton } from '../../components/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import VideoPlayer from 'react-native-video-player';
import theme from '../../../assets/styles/theme';
import { IconButton } from '../../components/theme';
import { Dispatch } from 'redux';
import { updateVideo } from '../../../store/sagas/user';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationParams } from '../../../../node_modules/@types/react-navigation';

interface State {
  path: "",
  recorded: Boolean,
  isRecording: Boolean,
  duration: number,
  time: number;
}

const mapDispatch = (dispatch: Dispatch) => ({
  onUpdateVideo: (data: any) => dispatch(updateVideo(data))
});

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  onUpdateVideo: Function;
}

class ProfileVideoScreen extends React.Component<Props, State> {
  camera?: RNCamera | null;
  timer = 0;

  state: State = {
    path: "",
    recorded: false,
    isRecording: false,
    duration: 14,
    time: 14,
  };

  takeVideo = () => {
    this.state.isRecording ? this.stopRecord() : this.saveVideo();
    this.state.isRecording ? this.setState({ isRecording: false }) : this.setState({ isRecording: true })
  }

  saveVideo = async () => {
    if (this.camera) {
      const { onUpdateVideo, navigation } = this.props;
      this.startTimer();
      const options = { maxDuration: this.state.duration, quality: RNCamera.Constants.VideoQuality["720p"] }
      const data = await this.camera.recordAsync(options)
      this.setState({ path: data.uri })
      this.setState({ recorded: false })
    }
  }

  uploadVideo = () => {
    const { path } = this.state;
    const { onUpdateVideo, navigation } = this.props;
    if(path)
    {
      onUpdateVideo({uri:path});
      navigation.goBack();
    }
  }

  startTimer = () => {
    this.setState({ time: this.state.duration });
    this.timer = setInterval(this.countDown, 1000);
  }

  countDown = () => {
    let seconds = this.state.time - 1;
    this.setState({ time: seconds });
    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

  stopRecord = async () => {
    if (this.camera) {
      this.camera.stopRecording();
      clearInterval(this.timer);
      const str = this.state.path;
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    this.setState({ path: '' });
    navigation.goBack();
  }

  retakeVideo = () => {
    this.setState({
      path: "",
      recorded: false,
      isRecording: false,
      duration: 14,
      time: 14,
    });
    this.takeVideo()
  }
 

  render() {
    const { path } = this.state;
    if(path)
    {
      return(
    <View flex={1} >
      <View style={[styles.container, { padding: 0 }]}>      
          <VideoPlayer
          video={{ uri: path }}
          videoWidth={Dimensions.get("window").width}
          videoHeight={Dimensions.get("window").height-150}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.footerCol}>
          <TextButton
            text="DELETE"
            onPress={this.goBack}
          />
        </View>
        <View style={styles.footerCol}>
          <TextButton
            text="RETAKE"
            onPress={this.retakeVideo}
          />
        </View>
        <View style={styles.footerCol}>
          <TextButton
            text="SAVE"
            onPress={this.uploadVideo}
          />
        </View>
      </View> 
    </View>
      )
    }
    else
    {

    return (
      <Screen>
        <RNCamera

          ref={ref => { this.camera = ref; }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={true}
          ratio={"16:9"}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
        />
        <View style={styles.footer}>
          <View style={styles.footerCol}>
            {/* <IconButton icon="times" primary="#FFF" secondary="transparent"  /> */}
          </View>
          <View style={styles.footerCol}>
            {
              this.state.isRecording ? (
                <IconButton circle icon="stop" onPress={this.takeVideo} />
              ) : (
                  <IconButton circle icon="video-camera" onPress={this.takeVideo} />
                )
            }
          </View>
          <View style={styles.footerCol}>
            <Text>{this.state.time}</Text>
          </View>
        </View>
      </Screen>
    )   
  } 
  }
}
export default connect(null, mapDispatch)(ProfileVideoScreen);
// export default ProfileVideoScreen;
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
  },
  footer: {
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});