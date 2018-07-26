import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PrimaryButton, TextArea } from '../../components/theme';
import ShadowBox from '../../components/theme/shadow-box';
import Screen from '../../components/screen';
import { MediaGrid, MediaGridItem } from '../../components/theme/media-grid';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import validator from "validator";
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import WonderAppState from "../../../types/wonder-app-state";
import { persistRegistrationInfo } from "../../../store/reducers/registration";

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
    return (
      <Screen horizontalPadding={20}>
        <ShadowBox>
          <MediaGrid

          />
          <TextArea
            style={{ height: 100 }}
            label="About Me"
            onChangeText={this.onAboutChangeText('about')}
            // tslint:disable-next-line
            placeholder={'Take this time to describe yourself, life experience, hobbies, and anything else that makes you wonderful.'}
          />
          <View style={{ marginTop: 10 }}>
            <PrimaryButton title="Next" onPress={this.validate} />
          </View>
        </ShadowBox>
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