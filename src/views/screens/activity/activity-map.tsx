import React from 'react';
import Screen from 'src/views/components/screen';
import MapView, { Marker as MarkerContainer, Callout } from 'react-native-maps';
import Marker from 'src/views/components/map/marker';
import ActivityCallout from 'src/views/components/map/activity-callout';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  getPartnerActivities,
  getActivityDetails,
} from 'src/store/sagas/partner';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import ActivityDetailsModal from 'src/views/components/modals/activity-details-modal';

import { persistActivity } from 'src/store/reducers/chat';
import {
  GeolocationReturnType,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  persistAppointmentData,
  AppointmentState,
} from 'src/store/reducers/appointment';
import askForDeviceLocation from 'src/services/gps';

import { selectCurrentUser } from 'src/store/selectors/user';
import WonderAppState from 'src/models/wonder-app-state';
import Coordinate from 'src/models/coordinate';
import User from 'src/models/user';
import Activity from 'src/models/activity';
import ActivityDetails from 'src/models/activity-details';

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state),
  activities: state.chat.activities,
  details: state.chat.activity,
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
  };

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
  };

  // {
  //   "lat": 41.887528,
  //   "lng": -88.305352
  // }

  renderMarker = (activity: Activity) => {
    const { onGetActivity, onUpdateAppointment } = this.props;
    const { id, name, latitude, longitude, topic } = activity;
    return (
      <MarkerContainer
        key={`${id} - ${name}`}
        coordinate={{ latitude, longitude }}
        // onPress={() => onGetActivity(id)}
      >
        <Marker title={topic.name} icon={topic.icon} />
        <Callout
          onPress={() => {
            onGetActivity(id);
            onUpdateAppointment({ topic: activity.topic });
          }}
        >
          <ActivityCallout activity={activity} />
        </Callout>
      </MarkerContainer>
    );
  };

  render() {
    const { activities, details, clearActivity } = this.props;
    const { position } = this.state;
    return (
      <Screen>
        <MapView
          showsUserLocation
          showsMyLocationButton
          rotateEnabled={false}
          style={{ flex: 1 }}
          region={{
            latitude: position.lat,
            longitude: position.lng,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
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

export default connect(
  mapState,
  mapDispatch,
)(ActivityMapScreen);
