import React from 'react';
import Screen from '../../components/screen';
import MapView, { Marker as MarkerContainer, Callout } from 'react-native-maps';
import Marker from '../../components/map/marker';
import ActivityCallout from '../../components/map/activity-callout';
import Activity from '../../../types/activity';
import WonderAppState from '../../../types/wonder-app-state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import User from '../../../types/user';
import { getPartnerActivities, getActivityDetails } from '../../../store/sagas/partner';
import { NavigationScreenProp, NavigationParams } from '../../../../node_modules/@types/react-navigation';
import ActivityDetailsModal from '../../components/modals/activity-details-modal';
import ActivityDetails from '../../../types/activity-details';
import { persistActivity } from '../../../store/reducers/chat';
import { GeolocationReturnType, Alert, PermissionsAndroid, Platform } from 'react-native';
import { persistAppointmentData, AppointmentState } from '../../../store/reducers/appointment';
import askForDeviceLocation from '../../../services/gps';
import Coordinate from '../../../types/coordinate';

const mapState = (state: WonderAppState) => ({
  currentUser: state.user.profile,
  activities: state.chat.activities,
  details: state.chat.activity
});

const mapDispatch = (dispatch: Dispatch) => ({
  onGetActivities: (id: number, coordinate?: Coordinate) => dispatch(getPartnerActivities({ id, coordinate })),
  onGetActivity: (id: string) => dispatch(getActivityDetails({ id })),
  onUpdateAppointment: (data: AppointmentState) => dispatch(persistAppointmentData(data)),
  clearActivity: () => dispatch(persistActivity(null))
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
      lng: 0
    }
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
        lat: coords.latitude
      }
    });

    onGetActivities(partnerId, coords);
  }

  onInviteMatch = () => {
    const { details, navigation, clearActivity, onUpdateAppointment } = this.props;
    clearActivity();

    onUpdateAppointment({ activity: details });
    navigation.navigate('AppointmentInvite');
  }

  // {
  //   "lat": 41.887528,
  //   "lng": -88.305352
  // }

  renderMarker = (activity: Activity) => {
    const { onGetActivity, onUpdateAppointment } = this.props;
    const { name, latitude, longitude, location, topic, id } = activity;
    return (
      <MarkerContainer
        key={`${name} - ${latitude},${longitude}`}
        coordinate={{ latitude, longitude }}
      // onPress={() => onGetActivity(id)}
      >
        <Marker
          title={topic.name}
        />
        <Callout
          onPress={() => {
            onGetActivity(id);
            onUpdateAppointment({ topic: activity.topic });
          }}
        >
          <ActivityCallout
            activity={activity}
          />
        </Callout>
      </MarkerContainer>
    );
  }

  render() {
    const { activities, details, clearActivity } = this.props;
    const { position } = this.state;
    return (
      <Screen>
        <MapView
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
          rotateEnabled={false}
          // provider={PROVIDER_GOOGLE}
          // customMapStyle={MapTheme}
          style={{ flex: 1 }}
          // initialRegion={{
          //   latitude: position.lat,
          //   longitude: position.lng,
          //   latitudeDelta: 0.05,
          //   longitudeDelta: 0.05,
          // }}
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

export default connect(mapState, mapDispatch)(ActivityMapScreen);