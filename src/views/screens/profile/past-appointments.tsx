import React from 'react';
import Screen from '../../components/screen';
import { AppointmentList } from '../../components/appointment-list';
import { connect } from 'react-redux';
import WonderAppState from '../../../types/wonder-app-state';
import { Dispatch } from 'redux';
import { getAppointments } from '../../../store/sagas/appointment';
import Appointment, { DecoratedAppointment } from '../../../types/appointment';
import { selectPastAppointments } from '../../../store/selectors/appointment';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';

const mapState = (state: WonderAppState) => ({
  appointments: selectPastAppointments(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onRefreshAppointments: () => dispatch(getAppointments())
});

interface PastAppointmentsProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointments: DecoratedAppointment[];
  onRefreshAppointments: () => void;
}

class PastAppointmentsScreen extends React.Component<PastAppointmentsProps> {
  componentDidMount() {
    this.props.onRefreshAppointments();
  }

  goToAppointment = (appointment: DecoratedAppointment) => {
    this.props.navigation.navigate('PastAppointmentView', { appointment });
  }

  render() {
    const { appointments, onRefreshAppointments } = this.props;
    return (
      <Screen>
        <AppointmentList
          onRefresh={onRefreshAppointments}
          data={appointments}
          onPress={this.goToAppointment}
        />
      </Screen>
    );
  }
}

export default connect(mapState, mapDispatch)(PastAppointmentsScreen);