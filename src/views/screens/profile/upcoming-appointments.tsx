import React from "react";
import Screen from "src/views/components/screen";
import { AppointmentList } from "src/views/components/appointment-list";
import { connect } from "react-redux";

import { Dispatch } from "redux";
import { getAppointments } from "src/store/sagas/appointment";

import { selectUpcomingAppointments } from "src/store/selectors/appointment";
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import WonderAppState from "src/models/wonder-app-state";
import { DecoratedAppointment } from "src/models/appointment";

const mapState = (state: WonderAppState) => ({
  appointments: selectUpcomingAppointments(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onRefreshAppointments: () => dispatch(getAppointments())
});

interface UpcomingAppointmentsProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointments: DecoratedAppointment[];
  onRefreshAppointments: () => void;
}

class UpcomingAppointmentsScreen extends React.Component<
  UpcomingAppointmentsProps
> {
  componentDidMount() {
    this.props.onRefreshAppointments();
  }

  goToAppointment = (appointment: DecoratedAppointment) => {
    this.props.navigation.navigate("UpcomingAppointmentView", { appointment });
  };

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

export default connect(
  mapState,
  mapDispatch
)(UpcomingAppointmentsScreen);
