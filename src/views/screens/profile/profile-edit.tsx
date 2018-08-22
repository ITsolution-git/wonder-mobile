import React from 'react';
import Screen from 'src/views/components/screen';
import validator from 'validator';
import { PrimaryButton, TextInput } from 'src/views/components/theme';
import { View, StyleSheet } from 'react-native';
import WonderAppState from 'src/types/wonder-app-state';
import User from 'src/types/user';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { updateUser } from 'src/store/sagas/user';
import { selectCurrentUser } from 'src/store/selectors/user';

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: State) => dispatch(updateUser(data))
});

interface Props {
  navigation: NavigationScreenProp<NavigationParams>;
  currentUser: User;
  onSave: Function;
}

interface State {
  first_name: string;
  last_name: string;
  school: string;
  occupation: string;
  errors: StateErrors;
}

interface StateErrors {
  first_name?: string;
  last_name?: string;
  school?: string;
  occupation?: string;
}

class ProfileEditScreen extends React.Component<Props, State> {
  state: State = {
    first_name: this.props.currentUser.first_name,
    last_name: this.props.currentUser.last_name,
    school: this.props.currentUser.school,
    occupation: this.props.currentUser.occupation,
    errors: {}
  };

  validate = () => {
    const errors: StateErrors = {};
    const { onSave, navigation } = this.props;
    const { first_name, last_name, school, occupation } = this.state;

    if (validator.isEmpty(first_name)) {
      errors.first_name = "First name is required";
    }

    if (validator.isEmpty(last_name)) {
      errors.last_name = "Last name is required";
    }

    if (validator.isEmpty(school)) {
      errors.school = "Please enter your education";
    }

    if (validator.isEmpty(occupation)) {
      errors.occupation = "Please enter your occupation";
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

    onSave({ first_name, last_name, school, occupation });
    navigation.goBack();
  }

  onChangeText = (key: string) => {
    return (text: string) => {
      this.setState({
        ...this.state,
        [key]: text
      });
    };
  }

  render() {
    const { navigation, currentUser } = this.props;
    const { errors } = this.state;
    return (
      <Screen>
        <View style={styles.container}>
          <View style={styles.row}>
            <View flex={1}>
              <TextInput
                label="First Name"
                defaultValue={currentUser.first_name}
                onChangeText={this.onChangeText('first_name')}
                errorHint={errors.first_name}
              />
            </View>
            <View flex={1}>
              <TextInput
                label="Last Name"
                defaultValue={currentUser.last_name}
                onChangeText={this.onChangeText('last_name')}
                errorHint={errors.last_name}
              />
            </View>
          </View>
          <View>
            <TextInput
              label="Education"
              onChangeText={this.onChangeText('education')}
              defaultValue={currentUser.school}
              errorHint={errors.school}
            />
            <TextInput
              label="Occupaction"
              onChangeText={this.onChangeText('occupation')}
              defaultValue={currentUser.occupation}
              errorHint={errors.occupation}
            />
            <TextInput
              label="Zip Code"
              disabled
              defaultValue={currentUser.location}
            />
          </View>
        </View>
        <View>
          <PrimaryButton
            rounded={false}
            title="Save"
            onPress={this.validate}
          />
        </View>
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(ProfileEditScreen);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1
  },
  row: {
    flexDirection: 'row'
  }
});
