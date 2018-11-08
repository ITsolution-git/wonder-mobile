import React from 'react';
import Screen from 'src/views/components/screen';
import ShadowBox from 'src/views/components/theme/shadow-box';
import { MediaGrid } from 'src/views/components/theme/media-grid';
import { TextArea, PrimaryButton } from 'src/views/components/theme';
import { View, KeyboardAvoidingView, Text } from 'react-native';
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
import theme from 'src/assets/styles/theme';

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
      <Screen>
        <View style={{ paddingHorizontal: 20, flex: 1 }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={{ marginTop: 10, color: theme.colors.textColor, textAlign: 'center' }}
          >
            UPLOAD YOUR PHOTO'S &amp; VIBE VIDEO
          </Text>
          <KeyboardAvoidingView
            behavior="position"
            style={{ flex: 1 }}
            contentContainerStyle={{ flex: 1 }}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>

              <KeyboardDismissView>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <MediaGrid
                    width={Device.WIDTH - 80}
                    gutter={2}
                    onNewPicture={(data: Response | null) => navigation.navigate('ProfileCamera', { data })}
                    onNewVideo={(data: Response | null) => navigation.navigate('ProfileVideo', { data })}
                  />
                </View>
                <TextArea
                  label="About Me"
                  placeholder="Take this time to describe yourself, life experience, hobbies, and anything else that makes you wonderful..."
                  maxLength={200}
                  defaultValue={about}
                  onChangeText={this.onAboutChange}
                  style={{ minHeight: 100 }}
                />

              </KeyboardDismissView>

            </View>

          </KeyboardAvoidingView>
        </View>
        <PrimaryButton rounded={false} title="DONE" onPress={this.onSave} />
      </Screen >
    );
  }
}

export default connect(mapState, mapDispatch)(ProfileMediaScreen);
