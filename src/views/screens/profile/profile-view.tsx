import _ from 'lodash';
import React from 'react';

import { View, StyleSheet, Alert, AlertButton, AlertOptions } from 'react-native';
import Screen from 'src/views/components/screen';
import ElevatedButton from 'src/views/components/theme/elevated-button';
import { PrimaryButton, Text, SecondaryButton as Button, Title } from 'src/views/components/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { logoutUser, getUser } from 'src/store/sagas/user';
import Avatar, { AvatarSize } from 'src/views/components/theme/avatar';

import { selectCurrentUser } from 'src/store/selectors/user';
import User from 'src/models/user';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';
import WonderAppState from 'src/models/wonder-app-state';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  currentUser: User;
  onLogout: () => void;
  onRefreshProfile: () => void;
}

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onLogout: () => dispatch(logoutUser()),
  onRefreshProfile: () => dispatch(getUser())
});

class ProfileViewScreen extends React.Component<Props> {
  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this.props.onRefreshProfile();
  }

  goTo = (key: string, params?: any) => {
    const { navigation } = this.props;
    return () => navigation.navigate(key);
  }

  getProfileImage = () => {
    const { currentUser } = this.props;
    if (currentUser.images && currentUser.images.length) {
      return currentUser.images[0].url;
    }
    return null;
  }

  promptLogout = () => {
    const options = [
      { text: 'Cancel', onPress: _.noop },
      { text: 'Yes, Logout', onPress: this.props.onLogout || _.noop },
    ];

    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', options);
  }

  render() {
    const { currentUser, onLogout } = this.props;
    return (
      <Screen horizontalPadding={10}>
        <View flex={1} style={styles.row}>
          <View style={[styles.col, styles.heading]}>
            <Avatar
              rounded
              uri={this.getProfileImage()}
              size={AvatarSize.md}
            />
          </View>
        </View>
        <View flex={1}>
          <View style={styles.row}>
            <View style={styles.col}>
              <ElevatedButton
                icon="user"
                title={currentUser.first_name}
                onPress={this.goTo('ProfileEdit')}
              />
            </View>
            <View style={styles.col}>
              <ElevatedButton
                icon="heart"
                title="Activities"
                onPress={this.goTo('ProfileWonders')}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <ElevatedButton
                icon="image"
                title="Photos"
                onPress={this.goTo('ProfileMedia')}
              />
            </View>
            <View style={styles.col}>
              <ElevatedButton
                icon="envelope-o"
                title="Contact"
                onPress={this.goTo('Feedback')}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <ElevatedButton
                icon="gear"
                title="Settings"
                onPress={this.goTo('ProfilePreferences')}
              />
            </View>
            <View style={styles.col}>
              <ElevatedButton
                icon="question"
                title="FAQ"
                onPress={_.noop}
              />
            </View>
          </View>
        </View>

        <View style={{ marginVertical: 10 }}>
          <View style={styles.row}>
            <PrimaryButton
              fullWidth
              title="UPGRADE TO WONDER PREMIUM"
              onPress={_.noop}
            />
          </View>
          <View style={styles.row}>

            <View style={styles.col}>
              <Button
                rounded
                title="Logout"
                onPress={this.promptLogout}
              />
            </View>
            <View style={styles.col}>
              <Button
                rounded
                title="Deactivate"
                onPress={_.noop}
              />
            </View>
          </View>
        </View>
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(ProfileViewScreen);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  col: {
    flex: 1,
    padding: 5,
  },
  heading: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
