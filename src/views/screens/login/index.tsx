import React from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Text,
  RoundedTextInput,
  PrimaryButton
} from "src/views/components/theme";
import theme from "src/assets/styles/theme";
import Screen from "src/views/components/screen";
import Images, { Logo } from "src/assets/images";
import TextButton from "src/views/components/theme/text-button";
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import { connect } from "react-redux";
import ForgotPasswordModal from "../../components/modals/forgot-password-modal";

import { Dispatch } from "redux";
import { loginUser, forgotPassword } from "src/store/sagas/user";

import validator from "validator";
import WonderAppState from "src/models/wonder-app-state";
import UserCredentials from "src/models/user-credentials";

import { Toast } from "native-base";

type Email = string;

const mapState = (state: WonderAppState) => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  onLogin: (credentials: UserCredentials) => dispatch(loginUser(credentials)),
  onForgotPassword: (email: Email) =>
    dispatch(forgotPassword({ forgotEmail: email }))
});

interface Props {
  onLogin: Function;
  onForgotPassword: Function;
  navigation: NavigationScreenProp<any, NavigationParams>;
}

interface State {
  email: string;
  password: string;
  errors: StateErrors;
  modalVisible: boolean;
  forgotEmail: string;
}

interface StateErrors {
  email?: string;
  password?: string;
}

class LoginScreen extends React.Component<Props> {
  inputs: any = {};

  state: State = {
    email: "",
    password: "",
    errors: {},
    modalVisible: false,
    forgotEmail: ""
  };

  private onChangeText = (key: string) => {
    const { errors } = this.state;
    return (text: string) => {
      this.setState({
        [key]: text,
        errors: {
          ...errors,
          [key]: undefined
        }
      });
    };
  };

  private submit = () => {
    const errors: StateErrors = {};
    const { email, password } = this.state;
    const { onLogin, navigation } = this.props;

    if (!validator.isEmail(email)) {
      errors.email = "Please enter a valid email";
    }

    if (validator.isEmpty(password)) {
      errors.password = "Please enter your password";
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

    onLogin({ email, password, onSuccess: () => navigation.navigate("Main") });
  };

  focusOn = (key: string) => {
    return () => {
      if (this.inputs[key]) {
        this.inputs[key].focus();
      }
    };
  };

  private submitForgotEmail = () => {
    const { forgotEmail } = this.state;
    const errors: StateErrors = {};

    if (!validator.isEmail(forgotEmail)) {
      errors.email = "Please enter a valid email";
    }
    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }
    // fire the action
    this.props.onForgotPassword(forgotEmail);
    this.setState({ modalVisible: false, errors: {} });
  };

  render() {
    const { navigation } = this.props;
    const { errors } = this.state;

    return (
      <Screen style={{ backgroundColor: "#FFF" }}>
        <View flex={1} style={styles.header}>
          <Image
            style={{ width: "80%" }}
            source={Logo.DARK}
            resizeMode="contain"
          />
        </View>
        <View flex={1} style={styles.body}>
          <View style={{ width: "100%" }}>
            <RoundedTextInput
              returnKeyType="next"
              getRef={(input: RoundedTextInput) => {
                this.inputs.email = input;
              }}
              onSubmitEditing={this.focusOn("password")}
              autoCapitalize="none"
              autoCorrect={false}
              errorHint={errors.email}
              icon="envelope-o"
              placeholder="Email"
              onChangeText={this.onChangeText("email")}
              fullWidth
            />
          </View>
          <View style={{ marginTop: 10, width: "100%" }}>
            <RoundedTextInput
              returnKeyType="done"
              getRef={(input: RoundedTextInput) => {
                this.inputs.password = input;
              }}
              type="password"
              autoCapitalize="none"
              autoCorrect={false}
              errorHint={errors.password}
              icon="lock"
              placeholder="Password"
              onChangeText={this.onChangeText("password")}
              fullWidth
            />
          </View>
          <View
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <View style={{ marginTop: 10, width: "50%" }}>
              <PrimaryButton title="Login" onPress={this.submit} />
              <TextButton
                style={{
                  textAlign: "center",
                  color: theme.colors.textColor,
                  marginTop: 18
                }}
                text="Forgot Password?"
                onPress={() => this.setState({ modalVisible: true })}
              />
            </View>
            <View style={{ marginTop: 25, flexDirection: "row" }}>
              <Text>Don't have an account? </Text>
              <TextButton
                style={{ textAlign: "center", color: theme.colors.primary }}
                text="Register"
                onPress={() => navigation.goBack()}
              />
            </View>
          </View>
        </View>
        <ForgotPasswordModal
          getRef={(input: RoundedTextInput) => {
            this.inputs.forgotEmail = input;
          }}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
          onChangeText={this.onChangeText("forgotEmail")}
          submit={this.submitForgotEmail}
          errorHint={errors.email}
        />
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(LoginScreen);

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center"
  },
  body: {
    flex: 2,
    flexDirection: "column",
    alignItems: "center",
    padding: 20
  }
});
