import React from "react";
import Screen from "src/views/components/screen";
import { CalendarList, Agenda } from "react-native-calendars";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { View, Dimensions } from "react-native";
import Avatar from "src/views/components/theme/avatar";
import { Text } from "src/views/components/theme";
import {
  Text,
  Strong,
  PrimaryButton,
  Avatar
} from "src/views/components/theme";
import AgendaDayItem from "../../components/calendar/agenda-day-item";
import moment from "moment";
import TimePicker from "src/views/components/theme/pickers/time-picker";
import { selectUpcomingAppointments } from "src/store/selectors/appointment";
import WonderAppState from "src/models/wonder-app-state";
import { newWonderSaga } from "";
import {
  AppointmentState,
  persistAppointmentData
} from "src/store/reducers/appointment";
const mapState = (state: WonderAppState) => ({
  appointments: selectUpcomingAppointments(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  // getAllDates:dispatch(getAllDatesSaga)  <------ not written yet but for future reference
  onUpdateAppointment: (data: AppointmentState) =>
    dispatch(persistAppointmentData(data))
});

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  appointment: AppointmentState;
  onUpdateAppointment: (data: AppointmentState) => any;
}

interface State {
  selected: string;
  selectedTime: object;
  agendaItems: object;
  markedDates: object;
}
class ActivityScheduleScreen extends React.Component<Props, State> {
  state: State = {
    selectedDate: moment().format("YYYY-MM-DD"),
    selectedTime: { hour: moment().format("H"), minute: moment().format("mm") },
    agendaitems: {},
    markedDates: {}
    // moment()
    //   .add(15, "minutes")
    //   .toDate()
  };

  componentWillMount() {
    // this.props.getAllDates() <------ not written yet but for future reference (gets all appointmentss from the database)
    this.mapDaysToAgendaObjectFormat();
  }

  schedule = () => {
    const time = moment(
      this.state.selectedTime.hour + ":" + this.state.selectedTime.minute,
      "HH:mm"
    ).format("hh:mm");
    const DateandTime = this.state.selectedDate + " " + time;
    this.props.onUpdateAppointment({ eventAt: DateandTime });
    console.log(DateandTime);
    this.props.navigation.navigate("AppointmentConfirm");
  };

  mapDaysToAgendaObjectFormat = () => {
    let datesArray = this.mapOutDays();
    let agendaitems = {};
    console.log(this.props.appointments);

    datesArray = datesArray.map(date => {
      agendaitems[date] = [];
      return date;
    });

    let appointmentdate = "";
    let markedDates = {};
    this.props.appointments.map(appointment => {
      appointmentdate = moment(appointment["eventAt"], "MM-DD-YYYY").format(
        "YYYY-MM-DD"
      );
      markedDates[appointmentdate] = { disabled: true };
      agendaitems[appointmentdate] = agendaitems[appointmentdate].concat({
        dateAt: appointmentdate,
        text:
          "Date with " +
          appointment.match.first_name +
          " " +
          appointment.match.last_name
      });
      return appointment;
    });

    this.setState({ agendaitems, markedDates });
  };

  mapOutDays = () => {
    //
    //starts on the current day
    const today = moment().format("YYYY-MM-DD");
    let datesForAgenda = [today];
    let daysFromToday = 30;
    let currentDayFromToday = 0;
    while (currentDayFromToday < daysFromToday) {
      //
      //Date that is added to the items props in agenda component(see below)
      let dateBeingAddedToAgendaScroll = moment(
        datesForAgenda[currentDayFromToday],
        "YYYY-MM-DD"
      )
        .add(1, "days")
        .format("YYYY-MM-DD");
      //
      //added plus one because the date being added is going based on the next day
      datesForAgenda[currentDayFromToday + 1] = dateBeingAddedToAgendaScroll;
      currentDayFromToday++;
    }

    return datesForAgenda;
  };

  ActivityTitle = () => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "space-around",
        height: 180,
        paddingBottom: 15
      }}
    >
      <Avatar
        circle
        uri={
          "https://images.pexels.com/photos/407035/model-face-beautiful-black-and-white-407035.jpeg?auto=compress&cs=tinysrgb&h=350"
        }
      />
      <Text>Michelle</Text>
      <Text>Select Date and Time</Text>
    </View>
  );
  selectTime = selectedTime => {
    this.setState({ selectedTime });
  };
  selectDay = ({ dateString }) => {
    this.setState({ selectedDate: dateString });
  };

  render() {
    const { selected, agendaitems, markedDates } = this.state;

    return (
      <Screen>
        {this.ActivityTitle()}
        <Agenda
          markedDates={markedDates}
          items={agendaitems}
          loadItemsForMonth={month => {}}
          onCalendarToggled={calendarOpened => {}}
          onDayPress={this.selectDay}
          // callback that gets called when day changes while scrolling agenda list
          onDayChange={this.selectDay}
          selected={moment().format("YYYY-MM-DD")}
          minDate={moment().format("YYYY-MM-DD")}
          maxDate={moment()
            .add(1, "M")
            .format("YYYY-MM-DD")}
          pastScrollRange={50}
          futureScrollRange={50}
          renderEmptyData={() => {
            return <View />;
          }}
          renderItem={(item, firstItemInDay) => {
            return <AgendaDayItem {...item} />;
          }}
          renderEmptyDate={() => {
            return <View />;
          }}
          renderKnob={() => {
            return (
              <View>
                <Text>Show Calendar</Text>
              </View>
            );
          }}
          rowHasChanged={(r1, r2) => {
            return r1.text !== r2.text;
          }}
          scrollingEnabled
          onRefresh={() => console.log("refreshing...")}
          refreshing={false}
          refreshControl={null}
          theme={{
            todayTextColor: "#F68E56",
            selectedDayBackgroundColor: "#F68E56",
            agendaDayTextColor: "#8E8EAA",
            agendaDayNumColor: "#8E8EAA",
            agendaTodayColor: "#8E8EAA",
            agendaKnobColor: "#F68E56"
          }}
        />
        <View style={{ paddingHorizontal: 20 }}>
          <TimePicker
            label="Select a time"
            minDate={moment()
              .add(15, "minutes")
              .toDate()}
            initialDate={moment()
              .add(15, "minutes")
              .toDate()}
            onChange={this.selectTime}
          />
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                margin: 10,
                width: "50%"
              }}
            >
              <PrimaryButton title="Confirm" onPress={this.schedule} />
            </View>
          </View>
        </View>
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(ActivityScheduleScreen);
