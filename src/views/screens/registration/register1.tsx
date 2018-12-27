import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  Alert
} from 'react-native';
import { RoundedTextInput, PrimaryButton } from 'src/views/components/theme';
import Screen from 'src/views/components/screen';
import { Logo } from 'src/assets/images';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import validator from 'validator';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import WonderAppState from '../../../models/wonder-app-state';
import {
  persistRegistrationInfo,
  resetRegistration
} from 'src/store/reducers/registration';
import { checkUniqueness } from '@services';

interface Props {
  onSave: Function;
  onReset: Function;
  navigation: NavigationScreenProp<any, NavigationParams>;
}

interface State {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  errors: StateErrors;
  loading: boolean;
}

interface StateErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

const mapState = (state: WonderAppState) => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: State) => dispatch(persistRegistrationInfo(data)),
  onReset: () => dispatch(resetRegistration())
});

class Register1 extends React.Component<Props, State> {
  inputs: any = {
    first_name: null,
    last_name: null,
    email: null,
    phone: null
  };

  state: State = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    errors: {},
    loading: false
  };

  componentWillMount() {
    this.props.onReset();
  }

  focusNext = (key: string) => () => {
    if (this.inputs[key]) {
      this.inputs[key].focus();
    }
  }

  render() {
    const { errors, loading } = this.state;

    return (
      <Screen>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ minHeight: '90%' }}
        >
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.select({ android: -40, ios: 0 })}
            behavior='position'
            contentContainerStyle={{ flex: 1 }}
            // style={styles.body}
            style={{ flex: 1 }}
          >
            {/* <KeyboardDismissView style={{ flex: 1 }}> */}
            <View style={styles.header}>
              <Image
                style={{ width: '80%', maxHeight: 100 }}
                source={Logo.DARK}
                resizeMode='contain'
              />
            </View>
            <View style={styles.body}>
              <View style={{ width: '80%' }}>
                <RoundedTextInput
                  getRef={(input: any) => {
                    this.inputs.first_name = input;
                  }}
                  onSubmitEditing={this.focusNext('last_name')}
                  returnKeyType='next'
                  onValidate={(text: string) =>
                    text && !validator.isEmpty(text)
                  }
                  autoCorrect={false}
                  autoCapitalize='words'
                  errorHint={errors.first_name}
                  icon='user'
                  placeholder='First Name'
                  onChangeText={this.onChangeText('first_name')}
                  fullWidth
                  maxLength={50}
                  style={styles.roundedTextButton}
                />
              </View>
              <View style={{ marginTop: 10, width: '80%' }}>
                <RoundedTextInput
                  getRef={(input: any) => {
                    this.inputs.last_name = input;
                  }}
                  onSubmitEditing={this.focusNext('email')}
                  returnKeyType='next'
                  onValidate={(text: string) =>
                    text && !validator.isEmpty(text)
                  }
                  autoCorrect={false}
                  autoCapitalize='words'
                  errorHint={errors.last_name}
                  icon='user'
                  placeholder='Last Name'
                  onChangeText={this.onChangeText('last_name')}
                  fullWidth
                  maxLength={50}
                  style={styles.roundedTextButton}
                />
              </View>
              <View style={{ marginTop: 10, width: '80%' }}>
                <RoundedTextInput
                  getRef={(input: any) => {
                    this.inputs.email = input;
                  }}
                  onSubmitEditing={this.focusNext('phone')}
                  returnKeyType='next'
                  onValidate={(text: string) => text && validator.isEmail(text)}
                  autoCapitalize='none'
                  autoCorrect={false}
                  errorHint={errors.email}
                  icon='envelope-o'
                  placeholder='Email'
                  onChangeText={this.onChangeText('email')}
                  fullWidth
                  maxLength={50}
                  style={styles.roundedTextButton}
                />
              </View>
              <View style={{ marginTop: 10, width: '80%' }}>
                <RoundedTextInput
                  getRef={(input: any) => {
                    this.inputs.phone = input;
                  }}
                  returnKeyType='done'
                  onValidate={(text: string) =>
                    text && validator.isMobilePhone(text, 'en-US')
                  }
                  keyboardType='phone-pad'
                  autoCapitalize='none'
                  autoCorrect={false}
                  errorHint={errors.phone}
                  icon='phone'
                  placeholder='Mobile Number'
                  onChangeText={this.onChangeText('phone')}
                  fullWidth
                  maxLength={10}
                  style={styles.roundedTextButton}
                />
              </View>
            </View>
            {/* </KeyboardDismissView> */}
          </KeyboardAvoidingView>
        </ScrollView>
        <View>
          <PrimaryButton
            disabled={loading}
            rounded={false}
            title='Next'
            onPress={this.validate}
          />
        </View>
      </Screen>
    );
  }

  private validate = () => {
    const errors: StateErrors = {};
    const { navigation, onSave } = this.props;
    const {
      errors: stateErrors,
      first_name,
      last_name,
      email,
      phone,
      loading
    } = this.state;

    if (validator.isEmpty(first_name)) {
      errors.first_name = 'Please enter your first name';
    }

    if (validator.isEmpty(last_name)) {
      errors.last_name = 'Please enter your last name';
    }

    if (!validator.isEmail(email)) {
      errors.email = 'Please use a valid email address';
    }

    if (!validator.isMobilePhone(phone, 'en-US')) {
      errors.phone = 'Please enter your mobile phone number';
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

    this.setState({ loading: true }, async () => {
      const [emailIsUnique, phoneIsUnique] = await Promise.all([
        checkUniqueness({ email }),
        checkUniqueness({ phone })
      ]);

      if (!emailIsUnique) {
        errors.email = 'This email is already in use.';
      }

      if (!phoneIsUnique) {
        errors.phone = 'This phone is already in use.';
      }

      if (!emailIsUnique || !phoneIsUnique) {
        this.setState({ errors, loading: false });
        return;
      } else {
        this.setState({ loading: false }, () => {
          onSave({ first_name, last_name, email, phone });
          navigation.navigate('Register2');
        });
      }
    });
  }

  private onChangeText = (key: string) => {
    const { errors } = this.state;
    return (text: string) => {
      this.setState({
        ...this.state,
        [key]: text,
        errors: {
          ...errors,
          [key]: undefined
        }
      });
    };
  }
}

export default connect(
  mapState,
  mapDispatch
)(Register1);

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    maxHeight: 125,
    flex: 0,
    alignItems: 'center'
  },
  roundedTextButton: { height: 54 }
});
