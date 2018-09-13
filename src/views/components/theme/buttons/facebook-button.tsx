import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';

export default class FacebookLoginButton extends Component {

    render() {
        return (
            <View>
                <LoginButton
                    publishPermissions={["email"]}
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                // alert("Login failed with error: " + error.message);
                            } else if (result.isCancelled) {
                                // alert("Login was cancelled");
                            } else {
                                Alert.alert("Login was successful with data: " + JSON.stringify(result))
                            }
                        }
                    }
                    onLogoutFinished={() => alert("User logged out")} />
            </View>
        );
    }
};
