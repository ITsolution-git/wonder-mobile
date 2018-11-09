import _ from 'lodash';
import React from 'react';

import { Platform, Dimensions, Modal, View, StyleSheet, Alert, AlertButton, AlertOptions, Linking, TouchableHighlight, ScrollView } from 'react-native';
import Screen from 'src/views/components/screen';
import ElevatedButton from 'src/views/components/theme/elevated-button';
import { PrimaryButton, Text, SecondaryButton as Button, Title } from 'src/views/components/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { logoutUser, getUser, deactivateAccount } from 'src/store/sagas/user';
import Avatar, { AvatarSize } from 'src/views/components/theme/avatar';

import { selectCurrentUser, selectAuth } from 'src/store/selectors/user';
import User from 'src/models/user';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';
import WonderAppState from 'src/models/wonder-app-state';
import ProfileModalChat from 'src/views/components/modals/profile-modal-chat';
import { HTTP_DOMAIN } from "src/services/api";

import moment from 'moment';
import VideoPlayer from "react-native-video-player";
import LinearGradient from 'react-native-linear-gradient';
import { IconButton } from "../../components/theme";
import WonderImage from '../../components/theme/wonder-image';
import theme from '../../../assets/styles/theme';
import Wonder from "../../components/theme/wonder/wonder";
import Color from 'color';

const { height } = Dimensions.get('window');

const gradient = [lighten(theme.colors.primaryLight, 0.5), lighten(theme.colors.primary, 0.5)];

function lighten(color: string, value: number) {
  return Color(color).fade(value).toString();
}

interface AuthToken {
  uid: number;
  token: string;
}
interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  currentUser: User;
  onLogout: (id: number, token: string) => void;
  onRefreshProfile: () => void;
  deactivateUsersAccount: () => void;
  auth: AuthToken;
}

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state),
  auth: selectAuth(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onLogout: (id: number, token: string) => dispatch(logoutUser({ id, token })),
  onRefreshProfile: () => dispatch(getUser()),
  deactivateUsersAccount: () => dispatch(deactivateAccount())
});

class ProfileViewScreen extends React.Component<Props> {
  static navigationOptions = {
    header: null
  };

  state = {
    profileModalOpen: false,
    showVideo: false,
    contentHeight: 0,
    showDetails: false
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
  deactivateAccount = () => {
    const { currentUser } = this.props;

    const options = [
      { text: 'Cancel' },
      { text: 'Yes', onPress: this.props.deactivateUsersAccount },
    ];

    Alert.alert('Confirm Deactivate Account', 'Are you sure you want to deactivate your account?', options);
  }

  showFaq = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Sorry! This link cannot be opened on your device");
      }
    });
  }

  promptLogout = () => {
    const { onLogout, auth } = this.props;
    const options = [
      { text: 'Cancel', onPress: _.noop },
      { text: 'Yes, Logout', onPress: () => onLogout(auth.uid, auth.token) },
    ];

    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', options);
  }

  openProfileModal = () => {
    this.setState({ profileModalOpen: !this.state.profileModalOpen });
  }

  getTopics = () => {
    const { currentUser, conversation } = this.props;
    const candidate = conversation.partner;
    const candidateTopics = candidate.topics || [];
    const userTopics = currentUser.topics;

    return (
      <View style={{ flexDirection: 'row' }}>
        {currentUser &&
          candidateTopics.map((x: Topic) => {
            if (userTopics) {
              const active: boolean = !!userTopics.find(
                (i: Topic) => i.name === x.name
              );
              return (
                <Wonder key={x.name} topic={x} size={60} active={active} />
              );
            }
          })}
      </View>
    );
  }

  render() {
    const { currentUser, onLogout } = this.props;
    const { showVideo } = this.state;
    const years = moment().diff(currentUser.birthdate, 'years');

    return (
      <Screen horizontalPadding={10}>
        <View flex={1} style={styles.row}>
          <View style={[styles.col, styles.heading]}>
            <TouchableHighlight onPress={this.openProfileModal} underlayColor="transparent">
              <Avatar
                rounded
                uri={this.getProfileImage()}
                size={AvatarSize.md}
              />
            </TouchableHighlight>
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
                onPress={() => this.showFaq(`${HTTP_DOMAIN}/faq.html`)}
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
                onPress={this.deactivateAccount}
              />
            </View>
          </View>
        </View>
        <Modal
          transparent={true}
          animationType='fade'
          visible={this.state.profileModalOpen}
          onRequestClose={this.openProfileModal}
        >
          <LinearGradient
            colors={gradient}
            style={styles.modalContainer}
          >
            <View
              style={styles.modalInnerContainer}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.5)', 'transparent']}
                style={styles.topGradient}
              >
                <View style={styles.iconContainer} >
                  {currentUser.video ? <View>
                    {showVideo ? <IconButton
                      size={35}
                      icon={"camera"}
                      onPress={() => this.setState({ showVideo: !this.state.showVideo })}
                      primary={theme.colors.primaryLight}
                      secondary="transparent"
                    /> : <IconButton
                        size={35}
                        icon={"video-camera"}
                        onPress={() => this.setState({ showVideo: !this.state.showVideo })}
                        primary={theme.colors.primaryLight}
                        secondary="transparent"
                      />
                    }
                  </View> : <View />}
                  <IconButton
                    size={35}
                    icon={"close"}
                    onPress={this.openProfileModal}
                    primary={'#fff'}
                    secondary="transparent"
                  />
                </View>

              </LinearGradient>
              <View style={styles.scrollContainer}>
                <ScrollView >
                  {currentUser.video && showVideo ? <View style={styles.containerHeight}>
                    <VideoPlayer
                      customStyles={{ videoWrapper: styles.videoStyles }}
                      videoHeight={Platform.OS === 'ios' ? height / 3 * 2 * 4.74 : height * 2.58}
                      pauseOnPress={true}
                      disableFullscreen={true}
                      autoplay={true}
                      video={{
                        uri: `${currentUser.video}`
                      }}
                    />
                  </View> :
                    <View style={styles.imageContainer}>
                      {currentUser.images.map((i, index) => {
                        if (index === 0) {
                          return (
                            <View key={i.url}>
                              <WonderImage
                                background
                                style={styles.containerHeight}
                                uri={i.url}
                              >
                                <LinearGradient
                                  colors={['transparent', 'rgba(0,0,0,0.5)']}
                                  style={[styles.imageTopGradient]}
                                >
                                  <View>
                                    <Text allowFontScaling={false} style={styles.firstNameText}>
                                      {currentUser.first_name}, {years}
                                    </Text>
                                  </View>
                                </LinearGradient>
                              </WonderImage>
                              <View style={styles.infoContainer}>
                                <View style={{ flexDirection: 'row' }}>
                                  {currentUser && currentUser.topics.map((x) => {
                                    return (
                                      <Wonder key={x.name} topic={x} size={60} active={false} />
                                    );
                                  })}
                                </View>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.occupationText}
                                >
                                  {!!currentUser.occupation && currentUser.occupation}
                                </Text>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.genericText}
                                >
                                  {!!currentUser.school && currentUser.school}
                                </Text>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.genericText}
                                >
                                  {!!currentUser.about && currentUser.about}
                                </Text>
                              </View>
                            </View>
                          );
                        } else {
                          return (
                            <WonderImage
                              key={i.url}
                              style={styles.regularImageStyles}
                              uri={i.url}
                            />
                          );
                        }
                      })}
                    </View>}
                </ScrollView>
              </View>
            </View>
          </LinearGradient>
        </Modal>
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalInnerContainer: {
    position: 'relative', height: height / 3 * 2,
    borderRadius: 10, backgroundColor: '#f1f1f1',
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 15
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    padding: 5,
    zIndex: 999,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  iconContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scrollContainer: { borderRadius: 10, overflow: 'hidden' },
  containerHeight: { height: height / 3 * 2, zIndex: 1, justifyContent: 'flex-end' },
  imageContainer: { borderRadius: 10, overflow: 'hidden' },
  videoStyles: { backgroundColor: 'black', borderRadius: 10, overflow: 'hidden' },
  imageTopGradient: {
    padding: 10,
    zIndex: 999,
  },
  firstNameText: {
    fontSize: 26,
    color: '#fff',
    marginLeft: 5,
    marginBottom: 2,
    fontWeight: '800'
  },
  regularImageStyles: { height: height / 3 * 2, zIndex: 1 },
  topicsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  schoolText: { color: '#fff', marginLeft: 5, fontSize: 12 },
  distanceText: { color: '#fff', fontSize: 13, marginLeft: 2 },
  detailsChevron: { justifyContent: "flex-end" },
  occupationText: { marginLeft: 5, fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#333' },
  genericText: { marginLeft: 5, fontSize: 12, lineHeight: 18, color: '#333' },
  infoContainer: { backgroundColor: '#fff', padding: 10 }
});
