import React from 'react';
import { RNCamera } from 'react-native-camera';
import Screen from '../../components/screen';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../components/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
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
  duration:number,
  time:number;
}

const mapDispatch = (dispatch: Dispatch) => ({
  onUpdateVideo: (data: any) => dispatch(updateVideo(data))
}); 

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  onUpdateVideo:Function;
}

class ProfileVideoScreen extends React.Component<Props,State> {
  camera?: RNCamera | null;
  timer = 0;
  constructor(props)
  {
    super(props);
    this.saveVideo = this.saveVideo.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
  }
  state:State = {
    path: "",
    recorded: false,
    isRecording: false,
    duration:14,
    time:14,
  }
  

  takeVideo = () => { 
    console.log('state  ',this.state)
    this.state.isRecording ?  this.stopRecord() : this.saveVideo();
    this.state.isRecording ? this.setState({isRecording: false}) : this.setState({isRecording: true})
  }

  async saveVideo () { 
    console.log('save')
    if (this.camera) { 
      const { onUpdateVideo,navigation } = this.props;
      this.startTimer();
      const options = { maxDuration: this.state.duration }
      const data = await this.camera.recordAsync(options)
      console.log(' -- data -- ',data)
      this.setState({path: data.uri })
      this.setState({recorded: false})
      console.log("FILE", data.uri); // -- it returns - 
      onUpdateVideo(data);
      navigation.goBack();
      //'FILE', 'file:///data/user/0/com.project/cache/Camera/07395974-32e0-4e43-8f7c-af5ec2d7267b.mp4'
    }
  };

  startTimer = () => {    
    this.setState({time:this.state.duration});
      this.timer = setInterval(this.countDown, 1000);
  }

  countDown = () => {
    let seconds = this.state.time - 1;
    this.setState({time:seconds});
    if (seconds == 0) { 
      clearInterval(this.timer);
    }
  }

  async stopRecord(){
    if(this.camera)
    {
      this.camera.stopRecording();
      clearInterval(this.timer);
      const str = this.state.path;
      console.log('Stopped',str);
    }
  }

  render() {
    return (
      <Screen>
        <RNCamera  
          ref={ref => { this.camera = ref; }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={true}
          ratio = {"16:9"}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
        />
        <View style={styles.footer}>
            <View style={styles.footerCol}>
              {/* <IconButton icon="times" primary="#FFF" secondary="transparent"  /> */}
            </View>
            <View style={styles.footerCol}>
            {
              this.state.isRecording?(
                <IconButton circle icon="stop" onPress={this.takeVideo} />
              ):(
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

export default connect(null,mapDispatch)(ProfileVideoScreen);
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