import React from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Text, Button, PrimaryButton } from "src/views/components/theme";
import theme from "src/assets/styles/theme";
import Screen from "src/views/components/screen";
import Images, { Logo } from "src/assets/images";
import TextButton from "src/views/components/theme/text-button";
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import { LoginManager } from "react-native-fbsdk";

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

export default class Welcome extends React.Component<Props> {
  onFacebookLogin() {
    LoginManager.logInWithReadPermissions(["email", "public_profile"]).then(
      result => {
        if (result.isCancelled) {
          Alert.alert("login cancelled");
        } else {
          Alert.alert(
            "login successful with permissions: " +
              result.grantedPermissions.toString()
          );
        }
      },
      error => {
        Alert.alert("login failed with error: " + error);
      }
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <Screen backgroundImage={Images.WELCOME}>
        <View flex={1} style={styles.header}>
          <Image
            style={{ width: "80%" }}
            source={Logo.DARK}
            resizeMode="contain"
          />
        </View>
        <View style={styles.body}>
          <View style={{ width: "100%" }}>
            <PrimaryButton
              fullWidth
              icon="envelope-o"
              title="CREATE ACCOUNT"
              onPress={() => navigation.navigate("Register1")}
            />
            <Button
              rounded
              color="#3D90F0"
              icon="facebook"
              title="LOGIN WITH FACEBOOK"
              onPress={() => this.onFacebookLogin()}
              fullWidth
              style={styles.facebookLoginButton}
            />
          </View>
          <View style={{ marginTop: 25 }}>
            <Text color="#FFF" style={{ fontWeight: "bold" }}>
              Already have an account?
            </Text>
            <TextButton
              style={{
                textAlign: "center",
                color: theme.colors.primary,
                fontWeight: "bold"
              }}
              text="Sign In"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center"
  },
  body: {
    flex: 2,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  facebookLoginButton: {
    backgroundColor: "#FFF",
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1
  }
});
