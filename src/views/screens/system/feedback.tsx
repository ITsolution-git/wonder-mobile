import React from 'react';
import Screen from "src/views/components/screen";
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Text, Strong, TextArea, PrimaryButton, TextInput } from 'src/views/components/theme';
import theme from 'src/assets/styles/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { KeyboardDismissView } from 'src/views/components/keyboard-dismiss-view';

import { Dispatch } from 'redux';
import { submitFeedback } from 'src/store/sagas/feedback';
import { connect } from 'react-redux';
import SupportMessage from 'src/models/support-message';
import WonderAppState from 'src/models/wonder-app-state';
import { Content } from 'native-base';

interface FeedbackScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  onSubmitFeedback: (body: SupportMessage) => any;
}

interface FeedbackScreenState {
  subject: string;
  body: string;
}

const mapState = (state: WonderAppState) => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  onSubmitFeedback: (feedback: SupportMessage) => dispatch(submitFeedback(feedback))
});

// automatically get name and email from user in redux
class FeedbackScreen extends React.Component<FeedbackScreenProps, FeedbackScreenState> {
  state: FeedbackScreenState = {
    subject: '',
    body: ''
  };

  onChangeSubjectText = (text: string) => {
    this.setState({ subject: text });
  }

  onChangebodyText = (text: string) => {
    this.setState({ body: text });
  }

  submit = () => {
    const { subject, body } = this.state;
    const { onSubmitFeedback, navigation } = this.props;
    onSubmitFeedback({ subject, body });
    navigation.goBack();
  }

  render() {
    const { navigation } = this.props;
    return (
      <Screen horizontalPadding={20} style={{ paddingBottom: 20 }}>
        <Content>
          {/* <KeyboardAvoidingView
            behavior="position"
            style={{ flex: 1 }}
            contentContainerStyle={{ flex: 1 }}
          >
            <KeyboardDismissView style={{ flex: 1 }}> */}
          <Text style={styles.infoText}>
            We want you to have a{' '}
            <Strong style={{ color: theme.colors.primary }}>Wonderful</Strong>{' '}
            experience! We would love to hear your feedback.
              </Text>
          <View>
            <TextInput placeholder="Subject" onChangeText={this.onChangeSubjectText} />
            <TextArea
              onChangeText={this.onChangebodyText}
              placeholder="Message..."
              style={{ minHeight: 150, backgroundColor: '#E1E1E1', color: '#444' }}
            />
          </View>
          {/* </KeyboardDismissView>
          </KeyboardAvoidingView> */}
        </Content>
        <PrimaryButton
          title="Submit"
          onPress={this.submit}
        />
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(FeedbackScreen);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15
  },
  infoText: {
    fontSize: 18,
    paddingHorizontal: 25,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20
  }
});
