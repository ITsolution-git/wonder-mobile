import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Screen from 'src/views/components/screen';

import {
  Title,
  Text,
  SubTitle,
  PrimaryButton,
  IconButton,
  TextButton,
  SecondaryButton
} from 'src/views/components/theme';
import { View, StyleSheet, Alert } from 'react-native';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import AppointmentReviewModal from 'src/views/components/modals/appointment-review-modal';

import { selectCurrentUser } from 'src/store/selectors/user';
import { Dispatch } from 'redux';
import Avatar from 'src/views/components/theme/avatar';
import User from 'src/models/user';
import { DecoratedAppointment } from 'src/models/appointment';
import WonderAppState from 'src/models/wonder-app-state';
import theme from 'src/assets/styles/theme';
import { getConversation } from 'src/store/sagas/conversations';
import { cancelAppointment, declineAppointment } from 'src/store/sagas/appointment';
import { isAppointmentBeforeToday } from 'src/utils/appointment';
import { callPhoneNumber } from 'src/services/communication';
import UserService from 'src/services/uber';
import AmazonService from 'src/services/amazon';
import { Toast } from 'native-base';
import Color from 'color';
interface AppointmentViewProps {
  currentUser: User;
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointment: DecoratedAppointment;
  onGetConversation: (partnerId: number) => void;
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
  onCancelAppointment: (data) => dispatch(cancelAppointment(data)),
  onDeclineAppointment: (data) => dispatch(declineAppointment(data))
});

class AppointmentViewScreen extends React.Component<AppointmentViewProps> {
  static navigationOptions = ({ navigation }) => {
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );
    return {
      title: appointment.match.first_name
    };
  }

  state: AppointmentViewState = {
    isModalOpen: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    const open = navigation.getParam('review', false);
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
    await callPhoneNumber(url);
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
    navigation.navigate('AppointmentConfirm', {
      appointment
    });
  }

  renderConfirmationButton = (appointment: DecoratedAppointment) => {
    const { state, owner, me } = appointment;
    const isOwner = owner.id === me.id;
    if ((isOwner && state === 'negotiating') || (!isOwner && state === 'invited')) {
      return (
        <PrimaryButton title='Confirm' onPress={() => this.handleConfirmation(appointment)} />
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
        />
      );
    }
  }

  decline = () => {
    const { appointment } = this.props;
    Alert.alert(
      'Confirm Decline',
      'Are you sure you want to decline?',
      [
        { text: 'Cancel' },
        { text: 'YES', onPress: () => this.props.onDeclineAppointment(appointment) },
      ],
      { cancelable: false }
    );
  }

  cancel = () => {
    const { appointment } = this.props;
    Alert.alert(
      'Confirm Cancel',
      'Are you sure you want to cancel?',
      [
        { text: 'Cancel' },
        { text: 'YES', onPress: () => this.props.onCancelAppointment(appointment) },
      ],
      { cancelable: false }
    );
  }

  render() {
    const { navigation, currentUser } = this.props;
    const appointment: DecoratedAppointment = navigation.getParam(
      'appointment',
      {}
    );
    const isPast = this.isPastAppointment();
    return (
      <Screen horizontalPadding={20}>
        {/* <ScrollView
          style={{ flex: 1, paddingTop: 20 }}
          contentContainerStyle={{ flex: 1 }}
        > */}
        <View flex={1}>
          <View style={styles.header}>
            <Avatar
              circle
              size="xl"
              uri={_.get(appointment, 'match.images[0].url', null)}
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <Title align="center">
              {appointment.name} with {appointment.match.first_name}{' '}
              {isPast.toString()}
            </Title>

            <SubTitle align="center">{appointment.location}</SubTitle>
            {appointment.phone && (
              <TextButton
                btnStyle={{ alignSelf: 'center' }}
                text="appointment.phone"
                onPress={() => this.onCall(appointment.phone)}
              />
            )}
            {appointment.eventMoment && (
              <Text align="center">
                {appointment.eventMoment.format('MMMM Do, YYYY [at] h:mma')}
              </Text>
            )}
          </View>
        </View>

        <View>
          {
            isPast
              ? <PrimaryButton title="Leave Review" onPress={this.openReviewModal} />
              : this.renderConfirmationButton(appointment)
          }
          <View style={[styles.row, styles.buttonRow]}>
            {!isPast && (
              <View style={styles.col}>
                <IconButton
                  size={50}
                  iconSize={44}
                  icon="car"
                  primary={theme.colors.primaryLight}
                  secondary="transparent"
                  onPress={this.onUber}
                />
                <Text style={styles.btnLabel}>Catch a Ride</Text>
              </View>
            )}
            {!isPast && (
              <View style={styles.col}>
                <IconButton
                  size={50}
                  iconSize={44}
                  icon="shopping-cart"
                  primary={theme.colors.primaryLight}
                  secondary="transparent"
                  onPress={this.onAmazon}
                />
                <Text style={styles.btnLabel}>Shop Amazon</Text>
              </View>
            )}
            {isPast && (
              <View style={styles.col}>
                <IconButton
                  size={50}
                  iconSize={44}
                  icon="gift"
                  primary={theme.colors.primaryLight}
                  secondary="transparent"
                  onPress={() => this.onServicePress('1-800-Flowers')}
                />
                <Text style={styles.btnLabel}>Send Flowers</Text>
              </View>
            )}
            <View style={styles.col}>
              <IconButton
                size={50}
                iconSize={44}
                icon="comments"
                primary={theme.colors.primaryLight}
                secondary="transparent"
                onPress={this.goToChat}
              />
              <Text style={styles.btnLabel}>Chat</Text>
            </View>
          </View>

          <View
            style={[
              styles.row,
              { marginVertical: 15, justifyContent: 'space-between' }
            ]}
          >
            {!isPast && (
              <View style={styles.col}>
                <SecondaryButton title="Cancel" onPress={this.cancel} />
              </View>
            )}
            <View style={styles.col}>
              <SecondaryButton title="Decline" onPress={this.decline} />
            </View>
          </View>
        </View>
        {/* </ScrollView> */}
        <AppointmentReviewModal
          onRequestClose={this.closeReviewModal}
          visible={this.state.isModalOpen}
          currentUser={currentUser}
          appointment={appointment}
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
    justifyContent: 'space-around'
  },
  col: {
    flex: 1,
    alignItems: 'center'
  },
  btnLabel: {
    textAlign: 'center',
    fontSize: 12
  }
});
