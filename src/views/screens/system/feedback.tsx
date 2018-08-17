import React from 'react';
import Screen from "../../components/screen";
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Text, Strong, RoundedTextInput, TextArea, PrimaryButton } from '../../components/theme';
import theme from '../../../assets/styles/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { KeyboardDismissView } from '../../components/keyboard-dismiss-view';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

// automatically get name and email from user in redux
class FeedbackScreen extends React.Component<Props> {
  render() {
    const { navigation } = this.props;
    return (
      <Screen>
        <KeyboardAvoidingView
          behavior="position"
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <KeyboardDismissView style={{ flex: 1 }}>
            <View flex={1} style={styles.container}>
              <Text style={styles.infoText}>
                We want you to have a <Strong style={{ color: theme.colors.primary }}>Wonderful</Strong> experience! We would love to hear your feedback
          </Text>
              <TextArea
                placeholder="Message..."
                style={{ minHeight: 150 }}
              />
            </View>
          </KeyboardDismissView>
        </KeyboardAvoidingView>
        <PrimaryButton
          rounded={false}
          fullWidth
          title="Submit"
          onPress={() => navigation.goBack()}
        />
      </Screen>
    )
  }
}

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 18,
    paddingHorizontal: 25,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20
  }
});