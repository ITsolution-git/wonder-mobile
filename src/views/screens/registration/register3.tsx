import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { PrimaryButton, TextArea } from 'src/views/components/theme';
import ShadowBox from 'src/views/components/theme/shadow-box';
import Screen from 'src/views/components/screen';
import { MediaGrid, MediaGridItem } from 'src/views/components/theme/media-grid';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import validator from "validator";
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import WonderAppState from "../../../models/wonder-app-state";
import { persistRegistrationInfo } from "../../../store/reducers/registration";
import { Device } from 'src/assets/styles/theme';
import { KeyboardDismissView } from 'src/views/components/keyboard-dismiss-view';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  onSave: Function;
}

interface State {
  images: any[];
  video: any[];
  about?: string;
  errors: StateErrors;
}

interface StateErrors {
  images?: string;
  video?: string;
  about?: string;
}

const mapState = (state: WonderAppState) => ({});
const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: State) => dispatch(persistRegistrationInfo(data))
});

class Register3 extends React.Component<Props, State> {

  state: State = {
    images: [],
    video: [],
    about: '',
    errors: {}
  };

  private onAboutChangeText = (key: string) => {
    const { errors } = this.state;
    return (text: string) => {
      this.setState({
        about: text,
        errors: {
          ...errors,
          [key]: undefined
        }
      });
    };
  }

  private validate = () => {
    const { onSave, navigation } = this.props;
    const { about } = this.state;

    onSave({ about });

    navigation.navigate('Register4');
  }

  render() {
    const { navigation } = this.props;
    return (
      <Screen horizontalPadding={20}>
        <KeyboardAvoidingView
          behavior="position"
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <KeyboardDismissView>
            <MediaGrid
              width={Device.WIDTH - 80}
              gutter={2}
              onNewPicture={() => navigation.navigate('ProfileCamera')}
              onNewVideo={() => navigation.navigate('ProfileVideo')}
            />
            <TextArea
              label="About Me"
              onChangeText={this.onAboutChangeText('about')}
              // tslint:disable-next-line
              placeholder='Take this time to describe yourself, life experience, hobbies, and anything else that makes you wonderful...'
              maxLength={200}
            />
          </KeyboardDismissView>
        </KeyboardAvoidingView>
        <View style={{ marginVertical: 10 }}>
          <PrimaryButton title="Next" onPress={this.validate} />
        </View>
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(Register3);

const styles = StyleSheet.create({
  welcome: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
