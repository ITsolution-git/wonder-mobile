import React from "react";
import { View } from "react-native";
import { TextInput } from "src/views/components/theme";
import Screen from "src/views/components/screen";
import { AppointmentList } from "src/views/components/appointment-list";
import { connect } from "react-redux";
import theme from "src/assets/styles/theme";
import { Dispatch } from "redux";
import { getAppointments } from "src/store/sagas/appointment";
import moment from "moment-timezone";
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
  state = {
    search: ""
  };
  componentDidMount() {
    this.props.onRefreshAppointments();
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
    const { appointments, onRefreshAppointments } = this.props;
    const filteredAppointments = this.filterAppointments();
    if (filteredAppointments.length) {
      return (
        <AppointmentList
          onRefresh={onRefreshAppointments}
          data={appointments}
          onPress={this.goToAppointment}
        />
      );
    }
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
