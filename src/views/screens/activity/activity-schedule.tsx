import React from "react";
import { View, Alert } from "react-native";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import _ from 'lodash';
import RNCalendarEvents, { RNCalendarEvent } from 'react-native-calendar-events';
import { Agenda } from "react-native-calendars";

import Screen from "src/views/components/screen";
import {
  Text,
  PrimaryButton,
} from "src/views/components/theme";
import AgendaDayItem, { AgendaDayItemProps } from "src/views/components/calendar/agenda-day-item";
import moment from "moment";
import TimePicker from 'src/views/components/theme/pickers/time-picker';
import { selectUpcomingAppointments } from "src/store/selectors/appointment";
import WonderAppState from "src/models/wonder-app-state";
import {
  AppointmentState,
  persistAppointmentData
} from "src/store/reducers/appointment";
import { NavigationParams, NavigationScreenProp } from "react-navigation";
import Avatar from "src/views/components/theme/avatar";
import { DecoratedAppointment } from "src/models/appointment";

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
  selected?: string;
  selectedDate: string;
  selectedTime: {
    hour: string;
    minute: string;
  };
  agendaItems: any;
  markedDates: object;
}

class ActivityScheduleScreen extends React.Component<Props, State> {
  state: State = {
    selected: undefined,
    selectedDate: moment().format("YYYY-MM-DD"),
    selectedTime: { hour: moment().format("H"), minute: moment().format("mm") },
    agendaItems: {},
    markedDates: {}
    // moment()
    //   .add(15, "minutes")
    //   .toDate()
  };

  componentWillMount() {
    // not written yet but for future reference
    // (gets all appointmentss from the database or from asyncstorage)
    // this.props.getAllDates()
    // this.mapDaysToAgendaObjectFormat();
    this.mapNativeCalendarEventsToAgenda();

  }

  mapDaysToAgendaObjectFormat = () => {
    const datesArray = this.mapOutDays(); // <--returns a date of arrays

    //
    // Makes each date into a key of an object to conform to agenda item format
    const agendaItems = datesArray.reduce((result: any, date: any) => {
      result[date] = [];
      return result;
    }, {});
    this.mapWonderAppointmentsToAgenda(agendaItems);
  }

  mapOutDays = () => {
    //
    // starts on the current day
    const today = moment();
    const otherDates = _.range(0, 30).map((i: number) => {
      //
      // Date that is added to the items props in agenda component(see below)
      return today.clone().add(1, 'day').format("YYYY-MM-DD");
    });
    return [today.format('YYYY-MM-DD'), ...otherDates];
  }

  schedule = () => {
    const { selectedDate, selectedTime } = this.state;
    const time = moment(`${selectedDate}T${selectedTime.hour}:${selectedTime.minute}`,
      "YYYY-MM-DD[T]HH:mm")
      .toDate();
    this.props.onUpdateAppointment({ eventAt: time });
    this.props.navigation.navigate("AppointmentConfirm");
  }

  mapNativeCalendarEventsToAgenda = async () => {
    const TO_RCE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSS[Z]";
    const RCE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSSZ";
    //
    // Attaches native calendar events to wonder agenda
    try {
      const granted: string = await RNCalendarEvents.authorizeEventStore();
      Alert.alert('Permission', granted);
      if (granted === 'authorized') {
        //
        // gets todays utc and from a month from now
        const today = moment();
        const nextMonth = moment()
          .add(1, "month");

        //
        // Fetch all events from native calendar
        const events = await RNCalendarEvents.fetchAllEvents(
          today.utc().format(TO_RCE_TIME_FORMAT),
          nextMonth.utc().format(TO_RCE_TIME_FORMAT)
        );

        const agendaItems: any = {};
        const markedDates: any = {};

        events.map((event: RNCalendarEvent) => {
          const { startDate, endDate, title } = event;

          // // //
          // // // converts callback time to agenda format time
          const eventStartDate = moment(
            startDate,
            RCE_TIME_FORMAT
          ).format("YYYY-MM-DD");

          const eventEndDate = moment(
            endDate,
            RCE_TIME_FORMAT
          ).format("hh:ssA");

          agendaItems[eventStartDate] = [
            ...this.state.agendaItems[eventStartDate],
            {
              date_at: eventStartDate,
              text: title
            }
          ];
          markedDates[eventStartDate] = { marked: true };
        });
        this.setState({
          agendaItems: { ...this.state.agendaItems, ...agendaItems },
          markedDates
        });
      }
    } catch (error) {
      Alert.alert('DEV ERROR', error.message);
    }
  }

  mapWonderAppointmentsToAgenda = (appointments: DecoratedAppointment[]) => {
    // //
    // //Attaches calendar items to calendar dates
    const { agendaItems } = this.state;
    const markedDates: any = {};
    let appointmentdate = "";

    appointments.map((appointment: DecoratedAppointment) => {
      appointmentdate = moment(
        appointment.event_at,
        "YYYY-MM-DDTHH:mm:ss.SSSSZ"
      ).format("YYYY-MM-DD");

      const displaytime = moment(
        appointment.event_at,
        "YYYY-MM-DDTHH:mm:ss.SSSSZ"
      ).format("HH:ssA");
      //
      //
      markedDates[appointmentdate] = { marked: true };
      agendaItems[appointmentdate] = [
        ...agendaItems[appointmentdate],
        {
          date_at: displaytime,
          text:
            "Date with " +
            appointment.match.first_name +
            " " +
            appointment.match.last_name
        }
      ];
    });

    this.setState({ agendaItems, markedDates });
    this.mapNativeCalendarEventsToAgenda();
  }

  ActivityTitle = () => {
    const { navigation } = this.props;
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-around",
          height: 160,
          paddingBottom: 15
        }}
      >
        <Avatar
          circle
        />
        <Text>
          {navigation.getParam('currentUser').first_name + " " + navigation.getParam('currentUser').last_name}
        </Text>
      </View>
    );
  }

  selectTime = (selectedTime: { hour: string, minute: string }) => {
    this.setState({ selectedTime });
  }

  selectDay = ({ dateString }: { dateString: string }) => {
    this.setState({ selectedDate: dateString });
  }

  render() {
    const { selected, agendaItems, markedDates } = this.state;
    return (
      <Screen>
        {this.ActivityTitle()}
        <Agenda
          markedDates={markedDates}
          items={agendaItems}
          // onCalendarToggled={(calendarOpened: boolean) => { }}
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
          renderEmptyData={() => <View />}
          renderItem={(item: AgendaDayItemProps, firstItemInDay: boolean) => <AgendaDayItem {...item} />}
          renderEmptyDate={() => <View />}
          renderKnob={() => {
            return (
              <View>
                <Text>Show Calendar</Text>
              </View>
            );
          }}
          rowHasChanged={(r1: any, r2: any) => r1.text !== r2.text}
          // scrollingEnabled
          // onRefresh={() => null}
          // refreshing={false}
          // refreshControl={null}
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
