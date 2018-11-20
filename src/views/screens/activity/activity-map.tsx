import React from 'react';
import Screen from 'src/views/components/screen';
import MapView, { Marker as MarkerContainer, Callout } from 'react-native-maps';
import Marker from 'src/views/components/map/marker';
import ActivityCallout from 'src/views/components/map/activity-callout';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  getPartnerActivities,
  getActivityDetails
} from 'src/store/sagas/partner';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import ActivityDetailsModal from 'src/views/components/modals/activity-details-modal';

import { persistActivity } from 'src/store/reducers/chat';
import {
  GeolocationReturnType,
  View,
  StyleSheet,
  Image
} from 'react-native';
import {
  persistAppointmentData,
  AppointmentState
} from 'src/store/reducers/appointment';
import askForDeviceLocation from 'src/services/gps';

import { selectCurrentUser } from 'src/store/selectors/user';
import WonderAppState from 'src/models/wonder-app-state';
import Coordinate from 'src/models/coordinate';
import User from 'src/models/user';
import Activity from 'src/models/activity';
import ActivityDetails from 'src/models/activity-details';

import theme from 'src/assets/styles/theme';

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state),
  activities: state.chat.activities,
  details: state.chat.activity,
  conversation: state.chat.conversation,
});

const mapDispatch = (dispatch: Dispatch) => ({
  onGetActivities: (id: number, coordinate?: Coordinate) =>
    dispatch(getPartnerActivities({ id, coordinate })),
  onGetActivity: (id: string) => dispatch(getActivityDetails({ id })),
  onUpdateAppointment: (data: AppointmentState) =>
    dispatch(persistAppointmentData(data)),
  clearActivity: () => dispatch(persistActivity(null)),
});

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  currentUser: User;
  activities: Activity[];
  details: ActivityDetails | null;
  onGetActivities: Function;
  onGetActivity: Function;
  clearActivity: Function;
  conversation: Conversation;
  onUpdateAppointment: (data: AppointmentState) => any;
}

interface State {
  position: any;
}

class ActivityMapScreen extends React.Component<Props, State> {
  state: State = {
    position: {
      lat: 0,
      lng: 0,
    },
  };

  componentWillMount() {
    const { navigation, onGetActivities, clearActivity } = this.props;
    const partnerId: number = navigation.getParam('id', 0);
    onGetActivities(partnerId);
    clearActivity();
  }

  componentDidMount() {
    askForDeviceLocation(this.updatePosition);
  }

  updatePosition = (position: GeolocationReturnType) => {
    const { navigation, onGetActivities, clearActivity } = this.props;
    const partnerId: number = navigation.getParam('id', 0);
    const { coords } = position;
    this.setState({
      position: {
        lng: coords.longitude,
        lat: coords.latitude,
      },
    });

    onGetActivities(partnerId, coords);
  }

  onInviteMatch = () => {
    const {
      details,
      navigation,
      clearActivity,
      onUpdateAppointment,
    } = this.props;
    clearActivity();
    onUpdateAppointment({ activity: details });
    navigation.navigate('WonderSchedule');
  }

  renderMarker = (activity: Activity) => {
    const { onGetActivity, onUpdateAppointment, currentUser, conversation } = this.props;
    const { id, name, latitude, longitude, topic } = activity;
    const { position } = this.state;
    const usersTopics = currentUser.topics.map((t: Topic) => t.name);
    const matchTopics = conversation.partner.topics.map((t: Topic) => t.name);

    return (
      <MarkerContainer
        key={`${id} - ${name}`}
        coordinate={{ latitude, longitude }}
      // onPress={() => onGetActivity(id)}
      >
        <View
          style={usersTopics.includes(topic.name) && matchTopics.includes(topic.name)
            ? styles.active : null}
        >
          <Marker title={topic.name} icon={topic.icon} />
        </View>
        <Callout
          tooltip={true}
          onPress={() => {
            onGetActivity(id);
            onUpdateAppointment({ topic: activity.topic });
          }}
        >
          <ActivityCallout userPosition={position} activity={activity} />
        </Callout>
      </MarkerContainer>
    );
  }

  render() {
    const { activities, details, clearActivity, conversation } = this.props;
    const { position } = this.state;

    return (
      <Screen>
        <MapView
          // showsUserLocation
          // showsMyLocationButton
          moveOnMarkerPress={false}
          mapType='mutedStandard'
          rotateEnabled={false}
          style={{ flex: 1 }}
          region={{
            latitude: position.lat,
            longitude: position.lng,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >

          <MarkerContainer
            coordinate={{
              latitude: Number(conversation.partner.latitude),
              longitude: Number(conversation.partner.longitude),
            }}
          >
            <Image
              style={{ height: 40, width: 40 }}
              resizeMode='contain'
              source={require('src/assets/images/icons/MapMatchIcon.png')} />
          </MarkerContainer>

          <MarkerContainer
            coordinate={{
              latitude: Number(this.state.position.lat),
              longitude: Number(this.state.position.lng),
            }}
          >
            <Image
              style={{ height: 40, width: 40 }}
              resizeMode='contain'
              source={require('src/assets/images/icons/WonderMapIcon.png')} />
          </MarkerContainer>

          {activities.map(this.renderMarker)}
        </MapView>
        <ActivityDetailsModal
          onRequestClose={() => clearActivity()}
          details={details}
          onCancel={clearActivity}
          onConfirm={this.onInviteMatch}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  active: {
    height: 34,
    width: 34,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
  },
});

export default connect(
  mapState,
  mapDispatch,
)(ActivityMapScreen);

// location: "90024"
