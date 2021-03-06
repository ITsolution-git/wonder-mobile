import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Screen from 'src/views/components/screen';
import {
  Title,
  Text,
  SubTitle,
  PrimaryButton,
  IconButton,
  TextButton,
  SecondaryButton, Strong
} from 'src/views/components/theme';
import {
  View,
  StyleSheet,
  Alert,
  Linking,
  Platform,
  TouchableOpacity,
  Dimensions,
  Share
} from 'react-native';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import AppointmentReviewModal from 'src/views/components/modals/appointment-review-modal';

import { selectCurrentUser } from 'src/store/selectors/user';
import { Dispatch } from 'redux';
import Avatar, {AvatarSize} from 'src/views/components/theme/avatar';
import User from 'src/models/user';
import { DecoratedAppointment } from 'src/models/appointment';
import WonderAppState from 'src/models/wonder-app-state';
import theme from 'src/assets/styles/theme';
import { getConversation } from 'src/store/sagas/conversations';
import {
  cancelAppointment,
  declineAppointment
} from 'src/store/sagas/appointment';
import { isAppointmentBeforeToday } from 'src/utils/appointment';
import { callPhoneNumber } from 'src/services/communication';
import UserService from 'src/services/uber';
import AmazonService from 'src/services/amazon';
import { Toast } from 'native-base';
import Color from 'color';

import api, {BASE_URL, fallbackImageUrl} from 'src/services/api';
import SvgUri from 'react-native-svg-uri';

import {
  deleteAttendance,
  getAttendances,
  reviewDate
} from 'src/store/sagas/attendance';
import Wonder from '../../components/theme/wonder/wonder';
import WonderImage from '../../components/theme/wonder-image';
import { confirmAppointment } from 'src/store/sagas/appointment';
import { AlertModal, IAlertModalProps } from '@components';
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';
import { setAlertModal, IAPIAlert } from '@actions';

const { height } = Dimensions.get('window');

const Viewport = Dimensions.get('window');

const IPHONE5_WIDTH = 640;
const IPHONE6_WIDTH = 750;
const IPHONE6Plus_WIDTH = 1242;
const IPHONEX_WIDTH = 1125;

interface AppointmentViewProps {
  currentUser: User;
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointment: DecoratedAppointment;
  onGetConversation: (partnerId: number) => void;
  onDeclineAppointment: (data: DecoratedAppointment) => void;
  onCancelAppointment: (data: DecoratedAppointment) => void;
  setAlertModal: (data: IAPIAlert) => void;
}

interface AppointmentViewState {
  isModalOpen: boolean;
}

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onGetConversation: (partnerId: number) =>
    dispatch(getConversation({ id: partnerId, successRoute: 'Chat' })),
  onCancelAppointment: (data: DecoratedAppointment) =>
    dispatch(cancelAppointment(data)),
  onDeclineAppointment: (data: DecoratedAppointment) =>
    dispatch(declineAppointment(data)),
  onDeleteAttendance: (data: DecoratedAppointment) =>
    dispatch(deleteAttendance(data)),
  onReviewDate: (data) => dispatch(reviewDate(data)),
  onConfirmAppointment: (appointment: DecoratedAppointment) =>
    dispatch(confirmAppointment({ appointment })),
  setAlertModal: (data: IAPIAlert) => dispatch(setAlertModal(data))
});

class AppointmentViewScreen extends React.Component<AppointmentViewProps> {
  static navigationOptions = ({ navigation }) => {
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );
    return {
      title: 'YOUR DATE'
    };
  }

  state: AppointmentViewState = {
    isModalOpen: false,
    modalOpen: false,
    isConfirmed: false,
    reviewDisabled: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );
    const open = navigation.getParam('review', false);
    // check if appointment has been reviewed by user
    this.setState({ reviewDisabled: appointment.reviewed_at ? true : false });
    RNCalendarEvents.authorizationStatus().then((status) => {
      if (status !== 'authorized') {
        RNCalendarEvents.authorizeEventStore();
      }
    });
    if (open) {
      this.openReviewModal();
      navigation.setParams({ review: false });
    }
  }

  isPastAppointment = () => {
    const { navigation } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );
    return isAppointmentBeforeToday(appointment);
  }

  openReviewModal = () => {
    this.setState({ isModalOpen: true });
  }

  closeReviewModal = () => {
    this.setState({ isModalOpen: false });
  }

  onCall = async (url?: string | null) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Sorry! This number can't be opened from the app");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }

  formatPhoneNumber = (phoneNumberString: String) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = (match[1] ? '+1 ' : '');
      return ['(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return '';
  }

  formatAddress = (location: any) => {
    if (location.length === 1) {
      return location.split(',');
    } else if (location.length === 3 ) {
      return location.split(',')
          .slice(0, 2).join(', ') + '\n' + location.split(', ')
          .slice(2, location.split(', ').length).join(', ');
    } else {
      return location.split(',')
          .slice(0, 1) + '\n' + location.split(', ')
          .slice(1, location.split(', ').length).join(', ');
    }
  }

  getWonderSize = () => {
    const resolution = Viewport.width * Viewport.scale
    if (resolution >= IPHONEX_WIDTH) {
      return 55;
    } else if (resolution >= IPHONE6_WIDTH && resolution < IPHONEX_WIDTH) {
      return 48;
    } else if (resolution < IPHONE6_WIDTH && resolution > IPHONE5_WIDTH) {
      return 40;
    } else if (resolution <= IPHONE5_WIDTH) {
      return 39;
    }
  }

  onServicePress = (url: string) => {
    Alert.alert('Third Party', `This would go to ${url}`);
  }

  onUber = async () => {
    const { navigation } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );
    const { location, longitude, latitude } = appointment;

    await UserService.scheduleUber({
      formattedAddress: location,
      longitude,
      latitude
    });
  }

  onAmazon = async () => {
    const { navigation } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );
    const { topic } = appointment;

    if (topic) {
      await AmazonService.search(topic.supplies_keywords);
    } else {
      Toast.show({ text: 'Unable to launch amazon, missing topic' });
    }
  }

  goToChat = () => {
    const { navigation, onGetConversation } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );

    onGetConversation(appointment.match.id);
  }

  handleConfirmation = (appointment: DecoratedAppointment) => {
    const { navigation } = this.props;
    this.setState({ modalOpen: true });
    this.props.onConfirmAppointment(appointment);
  }

  share = (appointment) => {
    Share.share({
      message: `Wanted to share with you the information for my date through Wonder. My date is with ${
        appointment.match.first_name
      } on  ${moment(appointment.event_at).format('MMMM Do')} at ${moment(
        appointment.event_at
      ).format('h:mma')} at ${appointment.name} at ${appointment.location}.`,
      title: `${appointment.owner.first_name}'s Wonder date!`
    });
  }

  renderConfirmationButton = (appointment: DecoratedAppointment) => {
    const { state, owner, me } = appointment;
    const { isConfirmed } = this.state;
    const isOwner = owner.id === me.id;
    if (
      (isOwner && state === 'negotiating' && !isConfirmed) ||
      (!isOwner && state === 'invited' && !isConfirmed)
    ) {
      return (
        <PrimaryButton
          title='Confirm'
          onPress={() => this.handleConfirmation(appointment)}
          innerStyle={{ minHeight: 30 }}
        />
      );
    } else {
      const label = state === 'confirmed' ? 'Confirmed' : 'Confirm';
      const greyedColor = Color(theme.colors.backgroundPrimary).toString();
      return (
        <PrimaryButton
          color={theme.colors.textColor}
          colors={[greyedColor, greyedColor]}
          title={label}
          onPress={_.noop}
          disabled
          innerStyle={{ minHeight: 30 }}
        />
      );
    }
  }

  decline = () => {
    const { navigation } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );

    Alert.alert(
      'Confirm Decline',
      'Are you sure you want to decline?',
      [
        { text: 'Cancel' },
        {
          text: 'YES',
          onPress: () => this.props.onDeclineAppointment(appointment)
        }
      ],
      { cancelable: false }
    );
  }

  cancelAndGoToChat = (date) => {
    this.props.onGetConversation(date.match.id, {});
    this.props.onCancelAppointment(date);
    // this.props.onDeleteAttendance(date);
    this.props.navigation.navigate('Chat', { name: date.match.first_name });
  }

  cancel = () => {
    const { navigation } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );

    this.props.setAlertModal({
      title: 'Confirm Cancel',
      body: `Are you sure you want to cancel?`,
      alertVisible: true,
      buttonTitle: 'Keep Date',
      buttonTitle2: 'Yes',
      onPress2: () => this.cancelAndGoToChat(appointment)
    });
  }

  openAddress = (lat, lng, label) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  }

  showDeleteAlert = () => {
    Alert.alert(
      'Confirm Remove',
      'Are you sure you want to remove this past date?',
      [
        { text: 'Cancel' },
        {
          text: 'YES',
          onPress: this.deletePastDate
        }
      ],
      { cancelable: false }
    );
  }

  deletePastDate = () => {
    const { navigation, currentUser } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );

    this.props.onDeleteAttendance(appointment);
    navigation.goBack();
  }

  getAvatarSize = () => {
    const resolution = Viewport.width * Viewport.scale;
    if (resolution > IPHONE6_WIDTH) {
      return AvatarSize.lg;
    } else if (resolution <= IPHONE6_WIDTH && resolution > IPHONE5_WIDTH) {
      return AvatarSize.md;
    } else if (resolution <= IPHONE5_WIDTH) {
      return AvatarSize.xmd;
    }
  }

  closeModal = () => {
    this.setState({
      modalOpen: false,
      isConfirmed: true,
      reviewDisabled: true
    });
  }

  private getModalProps = (): IAlertModalProps => {
    const { modalOpen } = this.state;

    const isPass = modalOpen === 'pass';
    const name = '';

    const modalProps = {
      visible: modalOpen,
      title: 'YAY!',
      body: `You've just confirmed a date. We've let them know!`,
      buttonTitle: 'Okay!',
      onRequestClose: this.closeModal,
      renderWonderful: false,
      onPress: this.closeModal
    };

    return modalProps;
  }

  componentWillUnmount() {
    this.setState({ reviewDisabled: false });
  }

  render() {
    const { navigation, currentUser } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );
    const { latitude, longitude } = appointment;
    const isPast = this.isPastAppointment();

    return (
      <Screen horizontalPadding={20}>
        <View flex={1}>
          <View style={styles.header}>
            <Avatar
              circle
              size={this.getAvatarSize()}
              uri={_.get(appointment, 'match.images[0].url', fallbackImageUrl)}
            />
          </View>
          <View style={styles.contentContainer}>
            <Title align='center' style={[ styles.titleFontSize, ]}>
              Invite {appointment.match
                ? appointment.match.first_name
                : 'Deactivated User'}{' '}{'\n'}
              on a {_.get(appointment, 'topic.name', null)} Date to:
            </Title>
            <View
                style={{
                  justifyContent: (appointment.state === 'invited' && isPast) ||
                      (appointment.state === 'declined' && isPast) ? 'center' : 'space-around',
                  flex: 1,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                  width: '100%'
                }}
            >
              <View style={[styles.body]}>
                <View style={{ marginRight: 15, maxWidth: '62%' }}>
                  <Text style={[styles.mainFontSize, styles.activityName]}>{appointment.name}</Text>
                  <Text
                    style={[styles.mainFontSize, styles.addressText]}
                    onPress={() =>
                      this.openAddress(
                        appointment.latitude,
                        appointment.longitude,
                        appointment.name
                      )
                    }
                  >
                    {this.formatAddress(appointment.location)}
                  </Text>
                  {appointment.eventMoment && (
                    <Strong
                      align='left'
                      style={[styles.mainFontSize, { marginTop: -4, marginBottom: -2 }]}
                    >
                      {appointment.eventMoment.format('MMMM Do [at] h:mma')}
                    </Strong>
                  )}
                  {appointment.phone !== null  && appointment.phone !== '' ? (
                    <TextButton
                      btnStyle={{ alignSelf: 'flex-start' }}
                      style={[styles.mainFontSize, styles.phoneText]}
                      text={this.formatPhoneNumber(appointment.phone)}
                      onPress={() => this.onCall(`tel:${appointment.phone}`)}
                    />
                  ) : null}
                </View>
                {/*<TouchableOpacity onPress={() => Linking.openURL('test.com')}>*/}
                {/*<Text style={[styles.linkText]}>*/}
                {/*Visit Website*/}
                {/*</Text>*/}
                {/*</TouchableOpacity>*/}
                <View style={{height: '100%', justifyContent: 'center'}}>
                  <WonderImage
                    style={{
                      width: this.getWonderSize(),
                      height: this.getWonderSize()
                    }}
                    uri={appointment.topic.icon}
                  />
                </View>
              </View>
              <View style={{ paddingHorizontal: ((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? 10 : 20, width: '100%' }}>
                {isPast ? (
                  <View>
                    {appointment.state === 'confirmed' ? (
                      <PrimaryButton
                        disabled={!appointment.reviewed_at ? false : true}
                        title={
                          !this.state.reviewDisabled ? 'Leave Review' : 'Left Review'
                        }
                        onPress={this.openReviewModal}
                        innerStyle={{ minHeight: 30 }}
                      />
                    ) : null}
                  </View>
                ) : (
                  this.renderConfirmationButton(appointment)
                )}
              </View>
            </View>

          </View>
        </View>
        <View style={{marginTop: -5}}>
          <View style={styles.row}>
            {!isPast && (
              <View style={styles.col}>
                <IconButton
                  size={50}
                  iconSize={height <= 680 ? 30 : 44}
                  icon='car'
                  primary={theme.colors.primaryLight}
                  secondary='transparent'
                  onPress={this.onUber}
                />
                <Text style={styles.btnLabel}>Catch a Ride</Text>
              </View>
            )}
            {!isPast && (
              <View style={styles.col}>
                <IconButton
                  size={50}
                  iconSize={height <= 680 ? 30 : 44}
                  icon='shopping-cart'
                  primary={theme.colors.primaryLight}
                  secondary='transparent'
                  onPress={this.onAmazon}
                />
                <Text style={styles.btnLabel}>Shop Amazon</Text>
              </View>
            )}
            {isPast && (
              <View style={styles.col}>
                <IconButton
                  size={50}
                  iconSize={height <= 680 ? 30 : 44}
                  icon='gift'
                  primary={theme.colors.primaryLight}
                  secondary='transparent'
                  onPress={() => this.onServicePress('1-800-Flowers')}
                />
                <Text style={styles.btnLabel}>Send Flowers</Text>
              </View>
            )}
            <View style={styles.col}>
              <IconButton
                size={50}
                iconSize={height <= 680 ? 30 : 44}
                icon='share'
                primary={theme.colors.primaryLight}
                secondary='transparent'
                onPress={() => this.share(appointment)}
              />
              <Text style={styles.btnLabel}>Share</Text>
            </View>
          </View>
          <View
            style={[
              styles.row,
              {
                marginVertical: 15,
                justifyContent: 'space-between'
              },
            ]}
          >
            {!isPast && (
              <View style={styles.col}>
                <SecondaryButton
                  disabled={
                    appointment.state === 'cancelled' ||
                    appointment.state === 'declined'
                      ? true
                      : false
                  }
                  title='Cancel'
                  onPress={this.cancel}
                  innerStyle={styles.BottomControlButton}
                />
              </View>
            )}
            <View style={styles.col}>
              {isPast ? (
                <SecondaryButton
                  title='Delete'
                  onPress={this.showDeleteAlert}
                  innerStyle={styles.BottomControlButton}
                />
              ) : (
                <SecondaryButton
                  disabled={
                    appointment.state === 'declined' ||
                    appointment.state === 'cancelled' ||
                    appointment.state === 'confirmed' ||
                    appointment.me.id === appointment.owner.id
                      ? true
                      : false
                  }
                  title='Decline'
                  onPress={this.decline}
                  innerStyle={styles.BottomControlButton}
                />
              )}
            </View>
          </View>
        </View>
        <AlertModal {...this.getModalProps()} />
        <AppointmentReviewModal
          onRequestClose={this.closeReviewModal}
          visible={this.state.isModalOpen}
          currentUser={currentUser}
          appointment={appointment}
          onSubmit={this.props.onReviewDate}
        />
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(AppointmentViewScreen);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center'
  },
  buttonRow: {
    marginVertical: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
    alignItems: 'center'
  },
  btnLabel: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10
  },
  phoneText: {
    color: 'rgb(0, 122, 255)',
    marginLeft: 0,
    textAlign: 'left',
  },
  addressText: {
    color: 'rgb(0, 122, 255)',
    marginLeft: 0,
    textAlign: 'left',
  },
  contentContainer: {
    flex: 1,
    marginTop: 5,
    alignItems: 'center'
  },
  activityName: {
    color: '#000',
    fontWeight: 'bold',
  },
  mainFontSize: {
    fontSize: ((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? 12 : 15,
  },
  titleFontSize: {
    fontSize: ((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? 11 : 13,
  },
  linkText: {
    color: 'rgb(0, 122, 255)',
    marginLeft: 0,
    textAlign: 'left',
    fontSize: ((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? 10 : 14,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  WonderIcon: {
    height: ((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? 42 : 51,
    width: ((Viewport.width * Viewport.scale) <= IPHONE5_WIDTH) ? 42 : 51,
  },
  BottomControlButton: {
    padding: 5,
    minHeight: 12,
  },
  ContentPadding: {
    paddingHorizontal: 20
  }
});
