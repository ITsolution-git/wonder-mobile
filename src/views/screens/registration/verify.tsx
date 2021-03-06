import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { RoundedTextInput, PrimaryButton } from 'src/views/components/theme';
import { loginUser, forgotPassword, getVerification } from 'src/store/sagas/user';
import { selectCurrentUser, selectAuth } from 'src/store/selectors/user';
import { Logo } from 'src/assets/images';
import theme from 'src/assets/styles/theme';
import WonderAppState from 'src/models/wonder-app-state';

const mapState = (state: WonderAppState) => ({
  currentUser: state.user
});

const mapDispatch = (dispatch: Dispatch) => ({
  onLoginUser: (data) => dispatch(loginUser(data)),
  onLogin: (credentials: UserCredentials) => dispatch(loginUser(credentials)),
  onGetVerification: (phone: string) => dispatch(getVerification(phone))
});

class VerifyScreen extends React.PureComponent {

 inputs: any = {
    code: ''
  };

  state: State = {
    code: '',
    errors: {}
  };

  onSubmit = () => {
    const { phone } = this.props.currentUser;
    const { code } = this.state;
    this.props.onLogin({ phone, code });
  }

  onResend = ():void => {
    const { phone } = this.props.currentUser;

    this.props.onGetVerification(phone);
  }


  render() {

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps='never'
          keyboardDismissMode='interactive'
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: '#fff' }}
          contentContainerStyle={{ flex: 1 }}
        >
          <View style={styles.headerContainer}>
            <Image
              style={styles.image}
              source={Logo.DARK}
              resizeMode='contain'
            />
            <Text style={styles.headerText}>
              {`Please enter the four digit verification code\nwe sent you to verify your account.`}
            </Text>
            <View style={{ width: '50%' }}>
              <RoundedTextInput
                getRef={(input: any) => {
                  this.inputs.code = input;
                }}
                autoCorrect={false}
                icon='lock'
                onChangeText={this.onChangeText('code')}
                maxLength={4}
              />
            </View>
            <View>
              <TouchableHighlight
                onPress={this.onResend}
                underlayColor='transparent'
              >
                <Text style={{ color: theme.colors.primary }}>
                  Resend Code
                </Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={styles.lowerContainer}>
            <PrimaryButton rounded={false} title='Next' onPress={this.onSubmit} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  private onChangeText = (key: string) => {

    return (text: string) => {
      this.setState({
        ...this.state,
        [key]: text,
      });
    };
  }
}

export default connect(mapState, mapDispatch)(VerifyScreen);

const styles = StyleSheet.create({
    header: {
    maxHeight: 125,
    flex: 0,
    alignItems: 'center'
  },
  headerText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: theme.colors.textColor
  },
  lowerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-around'
  },
  image: { width: '90%', maxHeight: 100 }
});
