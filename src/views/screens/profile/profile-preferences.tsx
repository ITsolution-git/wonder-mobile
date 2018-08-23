import React from 'react';
import Screen from 'src/views/components/screen';
import { SubHeader, Text, Toggle, PrimaryButton } from 'src/views/components/theme';
import { View, StyleSheet, ScrollView, Slider, RefreshControl } from 'react-native';
import theme from 'src/assets/styles/theme';

import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import { updateUser, getUser } from 'src/store/sagas/user';
import MultiPointSlider, { MultiPointSliderValue } from 'src/views/components/theme/multi-point-slider/multi-point-slider';
import WonderAppState from 'src/models/wonder-app-state';
import User from 'src/models/user';
import DistanceUnit from 'src/models/distance-unit';

const mapState = (state: WonderAppState) => ({
  profile: state.user.profile
});

const mapDispatch = (dispatch: Dispatch) => ({
  onSave: (profile: Partial<User>) => dispatch(updateUser(profile)),
  onRefresh: () => dispatch(getUser())
});

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  profile: User;
  onSave: Function;
  onRefresh: Function;
}

interface State {
  isScrollEnabled?: boolean;
  isRefreshing?: boolean;
  distance_of_interest_max?: number;
  age_of_interest_min?: number;
  age_of_interest_max?: number;
  male_interest?: boolean;
  female_interest?: boolean;
  available?: boolean;
  show_flakers?: boolean;
  show_ghosters?: boolean;
  show_fibbers?: boolean;
  military_time?: boolean;
  distance_unit?: DistanceUnit;
  apn_new_matches?: boolean;
  apn_new_messages?: boolean;
  apn_message_likes?: boolean;
  apn_message_super_likes?: boolean;
  geocoding_requested?: boolean;
}

class ProfileNotificationsScreen extends React.Component<Props, State> {
  static defaultProps = {
    profile: {}
  };

  constructor(props: Props) {
    super(props);
    this.state = this.loadProfile(props.profile);
  }

  loadProfile = (profile: User): State => ({
    isScrollEnabled: true,
    isRefreshing: false,
    distance_of_interest_max: profile.distance_of_interest_max || 0,
    age_of_interest_min: profile.age_of_interest_min || 18,
    age_of_interest_max: profile.age_of_interest_max || 24,
    male_interest: profile.male_interest,
    female_interest: profile.female_interest,
    available: profile.available,
    show_flakers: profile.show_flakers,
    show_ghosters: profile.show_ghosters,
    show_fibbers: profile.show_fibbers,
    military_time: profile.military_time,
    distance_unit: profile.distance_unit || DistanceUnit.miles,
    apn_new_matches: profile.apn_new_matches,
    apn_new_messages: profile.apn_new_messages,
    apn_message_likes: profile.apn_message_likes,
    apn_message_super_likes: profile.apn_message_super_likes,
    geocoding_requested: profile.geocoding_requested
  })

  onNumberChange = (key: string) => {
    return (value: number) => {
      this.setState({
        [key]: value
      });
    };
  }

  onBooleanChange = (key: string) => {
    return (value: boolean) => {
      this.setState({
        [key]: value
      });
    };
  }

  onChangeUnit = (key: string) => {
    return (value: boolean) => {
      this.setState({
        [key]: value ? DistanceUnit.miles : DistanceUnit.kilometers
      });
    };
  }

  onMultipointChange = (minKey: string, maxKey: string) => {
    return (value: MultiPointSliderValue) => {
      this.setState({
        [minKey]: value.selectedMinimum,
        [maxKey]: value.selectedMaximum
      });
    };
  }

  save = () => {
    const { onSave, navigation } = this.props;
    const {
      distance_of_interest_max,
      age_of_interest_min,
      age_of_interest_max,
      male_interest,
      female_interest,
      available,
      show_flakers,
      show_ghosters,
      show_fibbers,
      military_time,
      distance_unit,
      apn_new_matches,
      apn_new_messages,
      apn_message_likes,
      apn_message_super_likes,
      geocoding_requested
    } = this.state;

    onSave({
      distance_of_interest_max,
      age_of_interest_min,
      age_of_interest_max,
      male_interest,
      female_interest,
      available,
      show_flakers,
      show_ghosters,
      show_fibbers,
      military_time,
      distance_unit,
      apn_new_matches,
      apn_new_messages,
      apn_message_likes,
      apn_message_super_likes,
      geocoding_requested
    });
    navigation.goBack();
  }

  refresh = () => {
    const { onRefresh } = this.props;
    onRefresh();
    this.setState({ isRefreshing: true }, () => {
      setTimeout(() => this.setState({ isRefreshing: false }), 1500);
    });
  }

  render() {
    const { navigation } = this.props;
    const {
      isRefreshing,
      distance_of_interest_max,
      age_of_interest_min,
      age_of_interest_max,
      male_interest,
      female_interest,
      available,
      show_flakers,
      show_ghosters,
      show_fibbers,
      military_time,
      distance_unit,
      apn_new_matches,
      apn_new_messages,
      apn_message_likes,
      apn_message_super_likes,
      geocoding_requested
    } = this.state;

    return (
      <Screen>
        <ScrollView
          scrollEnabled={this.state.isScrollEnabled}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing || false}
              onRefresh={this.refresh}
            />
          }
        >
          <View style={{ paddingHorizontal: 20, flex: 1 }}>
            <View style={styles.heading}>
              <SubHeader>Notifications</SubHeader>
            </View>
            <View style={styles.row}>
              <Text>New Matches</Text>
              <Toggle
                value={apn_new_matches}
                onValueChange={this.onBooleanChange('apn_new_matches')}
              />
            </View>

            <View style={styles.row}>
              <Text>Messages</Text>
              <Toggle
                value={apn_new_messages}
                onValueChange={this.onBooleanChange('apn_new_messages')}
              />
            </View>

            <View style={styles.row}>
              <Text>Activities</Text>
              <Toggle
                disabled
              // value={true}
              // onValueChange={this.onBooleanChange('apn_activities')}
              />
            </View>

            <View style={styles.row}>
              <Text>Products &amp; Services</Text>
              <Toggle
                disabled
              // value={true}
              // onValueChange={this.onBooleanChange('apn_activities')}
              />
            </View>

            <View style={styles.heading}>
              <SubHeader>Settings</SubHeader>
            </View>
            {/* <View style={styles.row}>
              <Text>My Location</Text>
              <Toggle
                value={show_location}
                onValueChange={this.onBooleanChange('show_location')}
              />
            </View> */}

            <View style={styles.row}>
              <Text>Military Time</Text>
              <Toggle
                value={military_time}
                onValueChange={this.onBooleanChange('military_time')}
              />
            </View>

            <View style={styles.row}>
              <Text>Units ({distance_unit})</Text>
              <Toggle
                value={distance_unit === DistanceUnit.miles}
                onValueChange={this.onChangeUnit('distance_unit')}
              />
            </View>

            <View style={styles.heading}>
              <SubHeader>Interests</SubHeader>
            </View>
            <View style={styles.row}>
              <Text>Women</Text>
              <Toggle
                value={female_interest}
                onValueChange={this.onBooleanChange('female_interest')}
              />
            </View>

            <View style={styles.row}>
              <Text>Men</Text>
              <Toggle
                value={male_interest}
                onValueChange={this.onBooleanChange('male_interest')}
              />
            </View>

            <View style={styles.row}>
              <Text>Activity Partner</Text>
              <Toggle />
            </View>

            <View style={styles.heading}>
              <SubHeader>Age Range ({age_of_interest_max})</SubHeader>
            </View>
            <View style={styles.row}>
              <MultiPointSlider
                min={18}
                max={80}
                initialMinValue={age_of_interest_min}
                initialMaxValue={age_of_interest_max}
                onValueChange={this.onMultipointChange('age_of_interest_min', 'age_of_interest_max')}
              />
              {/* <Slider
                onValueChange={this.onNumberChange('age_of_interest_max')}
                minimumTrackTintColor={theme.colors.primary}
                style={{ width: '100%' }}
                minimumValue={18}
                maximumValue={80}
                value={age_of_interest_max}
                step={1}
              /> */}
              {/* <RangeSlider
              minValue={0}
              maxValue={100}
              handleColor={theme.colors.primary}
              tintColor={theme.colors.textColor}
              tintColorBetweenHandles={theme.colors.primaryLight}
              selectedMinimum={18}
              selectedMaximum={24}
              style={{ flex: 1, height: 70 }}
              onChange={(data) => { console.log(data); }}
            /> */}
            </View>

            <View style={styles.heading}>
              <SubHeader>Distance ({distance_unit}) - {distance_of_interest_max}</SubHeader>
            </View>
            <View style={styles.row}>
              <Slider
                onValueChange={this.onNumberChange('distance_of_interest_max')}
                minimumTrackTintColor={theme.colors.primary}
                style={{ width: '100%' }}
                value={distance_of_interest_max}
                minimumValue={1}
                maximumValue={50}
                step={1}
              />
            </View>

            <View style={styles.row}>
              <Text>Ghosters</Text>
              <Toggle
                value={show_ghosters}
                onValueChange={this.onBooleanChange('show_ghosters')}
              />
            </View>
          </View>
        </ScrollView>
        <View>
          <PrimaryButton
            rounded={false}
            title="Save"
            onPress={this.save}
          />
        </View>
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(ProfileNotificationsScreen);

const styles = StyleSheet.create({
  row: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 5
    },
    marginVertical: 5
  },
  heading: {
    marginTop: 15
  }
});
