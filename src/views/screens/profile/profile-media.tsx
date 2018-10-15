import React from 'react';
import Screen from 'src/views/components/screen';
import ShadowBox from 'src/views/components/theme/shadow-box';
import { MediaGrid } from 'src/views/components/theme/media-grid';
import { TextArea, PrimaryButton } from 'src/views/components/theme';
import { View, KeyboardAvoidingView } from 'react-native';
import { Device } from 'src/assets/styles/theme';
import { connect } from 'react-redux';
import { KeyboardDismissView } from 'src/views/components/keyboard-dismiss-view';
import { Dispatch } from 'redux';
import { updateUser } from 'src/store/sagas/user';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { selectCurrentUser } from 'src/store/selectors/user';
import WonderAppState from 'src/models/wonder-app-state';
import User from 'src/models/user';
import { Response } from 'src/models/image-picker';

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onUpdateUser: (data: Partial<User>) => dispatch(updateUser(data))
});

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  currentUser: User;
  onUpdateUser: (data: Partial<User>) => any;
}

interface State {
  about: string;
}

class ProfileMediaScreen extends React.Component<Props> {
  state = {
    about: this.props.currentUser.about || ''
  };

  onSave = () => {
    const { onUpdateUser, navigation } = this.props;
    const { about } = this.state;

    onUpdateUser({ about });
    navigation.goBack();
  }

  onAboutChange = (text: string) => {
    this.setState({ about: text });
  }

  render() {
    const { navigation } = this.props;
    const { about } = this.state;

    return (
      <Screen horizontalPadding={20}>
        <KeyboardAvoidingView
          behavior="position"
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ShadowBox>
              <KeyboardDismissView>
                <MediaGrid
                  width={Device.WIDTH - 80}
                  gutter={2}
                  onNewPicture={(data: Response | null) => navigation.navigate('ProfileCamera', { data })}
                  onNewVideo={(data: Response | null) => navigation.navigate('ProfileVideo', { data })}
                />
                <TextArea
                  label="About Me"
                  placeholder="Take this time to describe yourself, life experience, hobbies, and anything else that makes you wonderful..."
                  maxLength={200}
                  defaultValue={about}
                  onChangeText={this.onAboutChange}
                  style={{ minHeight: 100 }}
                />
                <View style={{ marginTop: 10 }}>
                  <PrimaryButton title="DONE" onPress={this.onSave} />
                </View>
              </KeyboardDismissView>
            </ShadowBox>
          </View>

        </KeyboardAvoidingView>
      </Screen >
    );
  }
}

export default connect(mapState, mapDispatch)(ProfileMediaScreen);
