import React from "react";
import { View, Linking, Alert } from "react-native";
import { TextInput } from "src/views/components/theme";
import Screen from "src/views/components/screen";
import { AppointmentList } from "src/views/components/appointment-list";
import { connect } from "react-redux";
import theme from "src/assets/styles/theme";
import { Dispatch } from "redux";
import { getAppointments } from "src/store/sagas/appointment";
import moment from "moment-timezone";
import { selectUpcomingAppointments, selectUpcomingAttendances } from "src/store/selectors/appointment";
import { deleteAttendance, getAttendances } from "src/store/sagas/attendance";
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import WonderAppState from "src/models/wonder-app-state";
import { DecoratedAppointment } from "src/models/appointment";

interface State {
  search: string;
}

const mapState = (state: WonderAppState) => ({
  appointments: selectUpcomingAppointments(state),
  attendances: selectUpcomingAttendances(state)
  // selectUpcomingAttendances(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  onRefreshAppointments: () => dispatch(getAppointments()),
  onDeleteAttendance: (data) => dispatch(deleteAttendance(data)),
  onRefreshAttendances: () => dispatch(getAttendances())
});

interface UpcomingAppointmentsProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointments: DecoratedAppointment[];
  onRefreshAppointments: () => void;
}

class UpcomingAppointmentsScreen extends React.Component<
  UpcomingAppointmentsProps
  > {
  state: State = {
    search: ""
  };
  componentDidMount() {
    this.props.onRefreshAppointments();
    this.props.onRefreshAttendances();
  }

  goToAppointment = (appointment: DecoratedAppointment) => {
    this.props.navigation.navigate("UpcomingAppointmentView", { appointment });
  }

  onSearchTextChange = (text: string) => {
    this.setState({ search: text.toLowerCase() });
  }

  filterAppointments = () => {
    const { search } = this.state;
    const { appointments } = this.props;

    if (search) {
      return appointments.filter((appointment) => {
        const locationName =
          appointment.name.toLowerCase().indexOf(search) >= 0;
        const matchName =
          appointment.match.first_name.toLowerCase().indexOf(search) >= 0;
        const date =
          moment(appointment.event_at)
            .format("LLLL")
            .toLowerCase()
            .indexOf(search) >= 0;

        return locationName || matchName || date;
      });
    }

    return appointments;
  }

  renderList = () => {
    const { appointments, onRefreshAppointments, attendances } = this.props;
    const filteredAppointments = this.filterAppointments();
    if (filteredAppointments.length) {
      return (
        <AppointmentList
          onPressCallNumber={this.callNumber}
          onRefresh={onRefreshAppointments}
          data={attendances}
          onPress={this.goToAppointment}
          onDelete={this.props.onDeleteAttendance}
        />
      );
    }
  }

  callNumber = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        Alert.alert("Sorry! This number can't be opened from the app");
      } else {
        return Linking.openURL(url);
      }
    }).catch((err) => console.error('An error occurred', err));
  }

  render() {

    return (
      <Screen>
        <View
          style={{
            paddingVertical: 15,
            width: "80%",
            alignSelf: "center"
          }}
        >
          <TextInput
            color={theme.colors.primaryLight}
            containerStyles={{ borderBottomColor: theme.colors.primaryLight }}
            autoCorrect={false}
            autoCapitalize="none"
            icon="search"
            placeholder="Name, Date or Location"
            onChangeText={this.onSearchTextChange}
          />
        </View>
        {this.renderList()}
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(UpcomingAppointmentsScreen);
