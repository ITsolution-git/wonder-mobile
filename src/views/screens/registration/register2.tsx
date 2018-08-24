import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  TextInput,
  Text,
  GenderPicker,
  PrimaryButton,
  DatePicker,
  Title
} from "src/views/components/theme";
import ShadowBox from "src/views/components/theme/shadow-box";
import Screen from "src/views/components/screen";
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import Gender from "../../../models/gender";
import moment from "moment-timezone";
import validator from "validator";
import { connect } from "react-redux";
import WonderAppState from "../../../models/wonder-app-state";
import { Dispatch } from "redux";
import registration, {
  persistRegistrationInfo,
  RegistrationState
} from "../../../store/reducers/registration";
import googleMaps, { GoogleGeoLocation } from "../../../services/google-maps";
import theme from "src/assets/styles/theme";
import { KeyboardDismissView } from "src/views/components/keyboard-dismiss-view";

interface Props {
  registration: RegistrationState;
  onSave: Function;
  navigation: NavigationScreenProp<any, NavigationParams>;
}

interface StateErrors {
  gender?: string;
  birthdate?: string;
  education?: string;
  occupation?: string;
  location?: string;
}

interface State {
  gender: Gender;
  birthdate: Date;
  education: string;
  occupation: string;
  location: string;
  geolocation: GoogleGeoLocation | null;
  errors: StateErrors;
}

const mapState = (state: WonderAppState) => ({
  registration: state.registration
});
const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (data: State) => dispatch(persistRegistrationInfo(data))
});

class Register2 extends React.Component<Props, State> {
  private eighteenYearsAgoToday = moment()
    .subtract(18, "years")
    .startOf("day");

  state: State = {
    gender: Gender.male,
    birthdate: this.eighteenYearsAgoToday.toDate(),
    education: "",
    occupation: "",
    location: "",
    geolocation: null,
    errors: {}
  };

  lookupLocation = async () => {
    const { location } = this.state;
    if (
      !validator.isEmpty(location) &&
      validator.isPostalCode(location, "US")
    ) {
      const geolocation: GoogleGeoLocation = await googleMaps.geocodeByZipCode(
        location
      );
      this.setState({ geolocation });
    } else {
      this.setState({ geolocation: null });
    }
  };

  formattedGeo = () => {
    const { geolocation } = this.state;
    if (geolocation) {
      return ` (${geolocation.city}, ${geolocation.state})`;
    }
    return "";
  };

  public render() {
    const { errors, birthdate } = this.state;
    const { registration } = this.props;

    return (
      <Screen horizontalPadding={20}>
        <ScrollView>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.select({ android: -40, ios: 0 })}
            behavior="position"
            contentContainerStyle={{ flex: 1 }}
            // style={styles.body}
            style={{ flex: 1 }}
          >
            {/* <KeyboardDismissView style={{ flex: 1 }}> */}
            <Title
              style={{ color: theme.colors.primaryLight, textAlign: "center" }}
            >
              Hello, {registration.first_name}
            </Title>
            <Text style={styles.welcome}>
              Tell us a little more about yourself
            </Text>
            <GenderPicker
              onChange={(gender: Gender) => this.onChangeText("gender")(gender)}
            />
            <DatePicker
              errorHint={errors.birthdate}
              label="BIRTHDAY"
              placeholder="Select Date"
              onChange={this.onDateChange}
              initialDate={birthdate}
              minDate={new Date("1950-01-01")}
              maxDate={this.eighteenYearsAgoToday.toDate()}
            />
            <TextInput
              onValidate={(text: string) => text && !validator.isEmpty(text)}
              label="EDUCATION"
              errorHint={errors.education}
              autoCorrect={false}
              autoCapitalize="words"
              onChangeText={this.onChangeText("education")}
            />
            <TextInput
              onValidate={(text: string) => text && !validator.isEmpty(text)}
              label="OCCUPATION"
              errorHint={errors.occupation}
              autoCorrect={false}
              autoCapitalize="words"
              onChangeText={this.onChangeText("occupation")}
            />
            <TextInput
              onValidate={(text: string) =>
                text && validator.isPostalCode(text, "US")
              }
              keyboardType="number-pad"
              label={`ZIP CODE${this.formattedGeo()}`}
              errorHint={errors.location}
              autoCorrect={false}
              autoCapitalize="words"
              onChangeText={this.onChangeText("location")}
              onBlur={this.lookupLocation}
            />
            <View style={{ marginVertical: 10 }}>
              <PrimaryButton title="Next" onPress={this.validate} />
            </View>
            {/* </KeyboardDismissView> */}
          </KeyboardAvoidingView>
        </ScrollView>
      </Screen>
    );
  }

  private onDateChange = (date: Date) => {
    this.setState({ birthdate: date });
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

  private validate = () => {
    const errors: StateErrors = {};
    const { navigation, onSave } = this.props;
    const { gender, education, occupation, birthdate, location } = this.state;

    if (GenderPicker.Genders.indexOf(gender) < 0) {
      errors.gender = "Please select a gender";
    }

    if (!birthdate) {
      errors.birthdate = "Please enter your birthday";
    } else if (moment(birthdate).isAfter(this.eighteenYearsAgoToday)) {
      errors.birthdate = "You are not old enough to use this app";
    }

    if (validator.isEmpty(education)) {
      errors.education = "Please enter where you went to school";
    }

    if (validator.isEmpty(occupation)) {
      errors.occupation = "Please enter your occupation";
    }

    if (validator.isEmpty(location)) {
      errors.location = "Please enter a Postal Code";
    } else if (!validator.isPostalCode(location, "US")) {
      errors.location = "Please enter a valid Postal Code";
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

    onSave({
      gender,
      location,
      school: education,
      occupation,
      birthdate: birthdate.toISOString().split("T")[0]
    });
    navigation.navigate("Register3");
  };
}

export default connect(
  mapState,
  mapDispatch
)(Register2);

const styles = StyleSheet.create({
  welcome: {
    fontSize: 14,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
