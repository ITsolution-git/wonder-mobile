import React from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../../components/screen';
import ElevatedButton from '../../components/theme/elevated-button';
import { PrimaryButton, Text, SecondaryButton as Button, Title } from '../../components/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import WonderAppState from '../../../types/wonder-app-state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import User from '../../../types/user';
import { logoutUser, getUser } from '../../../store/sagas/user';
import Avatar, { AvatarSize } from '../../components/theme/avatar';
import TouchableOpacityOnPress from '../../../types/touchable-on-press';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  currentUser: User;
  onLogout: TouchableOpacityOnPress;
  onRefreshProfile: Function;
}

const mapState = (state: WonderAppState) => ({
  currentUser: state.user.profile
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
                onPress={() => { }}
              />
            </View>
          </View>
        </View>

        <View style={{ marginVertical: 10 }}>
          <View style={styles.row}>
            <PrimaryButton
              fullWidth
              title="UPGRADE TO WONDER PREMIUM"
              onPress={() => { }}
            />
          </View>
          <View style={styles.row}>

            <View style={styles.col}>
              <Button
                rounded
                title="Logout"
                onPress={onLogout}
              />
            </View>
            <View style={styles.col}>
              <Button rounded title="Deactivate" />
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
