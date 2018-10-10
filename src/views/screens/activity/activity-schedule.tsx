import React from "react";
import { View, Alert, Animated, StyleSheet } from "react-native";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import _ from 'lodash';
import RNCalendarEvents, { RNCalendarEvent } from 'react-native-calendar-events';
import { Agenda, DateObject } from "react-native-calendars";

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
import { getDecoratedConversation } from "src/store/selectors/conversation";
import Conversation, { DecoratedConversation } from "src/models/conversation";
import User from "src/models/user";
import { selectCurrentUser } from "src/store/selectors/user";
import theme from "../../../assets/styles/theme";

interface StateProps {
  currentUser: User;
  conversation: Conversation | null;
  appointment: AppointmentState;
  appointments: ReadonlyArray<DecoratedAppointment>;
}
interface DispatchProps {
  onUpdateAppointment: (data: AppointmentState) => any;
}
interface Props extends StateProps, DispatchProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

interface State {
  selected?: string;
  selectedDate?: string;
  selectedTime: {
    hour: string;
    minute: string;
  };
  agendaItems: any;
  markedDates: object;
  headerHeight: Animated.Value;
}

export interface CalendarItem {
  title?: string;
  date?: Date;
  location?: string;
  start?: Date;
  end?: Date;
}

export interface CalendarItemMap {
  [key: string]: CalendarItem[];
}

const mapState = (state: WonderAppState): StateProps => ({
  currentUser: selectCurrentUser(state),
  conversation: getDecoratedConversation(state),
  appointments: selectUpcomingAppointments(state)
});

const mapDispatch = (dispatch: Dispatch): DispatchProps => ({
  // getAllDates:dispatch(getAllDatesSaga)  <------ not written yet but for future reference
  onUpdateAppointment: (data: AppointmentState) =>
    dispatch(persistAppointmentData(data))
});
class ActivityScheduleScreen extends React.Component<Props, State> {
  state: State = {
    selected: undefined,
    selectedDate: undefined,
    selectedTime: {
      hour: moment().format("H"),
      minute: moment().format("mm")
    },
    agendaItems: {},
    markedDates: {},
    headerHeight: new Animated.Value(150)
  };

  componentWillMount() {
    // not written yet but for future reference
    // (gets all appointmentss from the database or from asyncstorage)
    // this.props.getAllDates()
    this.mapDaysToAgendaObjectFormat();
  }

  mapDaysToAgendaObjectFormat = () => {
    // const datesArray = this.mapOutDays(); // <--returns a date of arrays

    // //
    // // Makes each date into a key of an object to conform to agenda item format
    // const agendaItems = datesArray.reduce((result: any, date: any) => {
    //   result[date] = [];
    //   return result;
    // }, {});
    // this.mapWonderAppointmentsToAgenda(this.props.appointments);
    this.mapNativeCalendarEventsToAgenda();
  }

  /**
   * Create an array of Dates as strings to be mapped as keys
   */
  mapOutDays = () => {
    //
    // starts on the current day
    const today = moment();
    const otherDates = _.range(0, 30).map((i: number) => {
      //
      // Date that is added to the items props in agenda component(see below)
      return today.clone().add(i, 'day').format("YYYY-MM-DD");
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

  /**
   * Reads the native calendar events from today to a month from now and loads them into state
   */
  mapNativeCalendarEventsToAgenda = async () => {
    const RCE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSSZ";

    //
    // Attaches native calendar events to wonder agenda
    try {
      const granted: string = await RNCalendarEvents.authorizeEventStore();
      if (granted === 'authorized') {
        //
        // gets todays utc and from a month from now
        const today = moment();
        const nextMonth = moment()
          .add(1, "month");

        //
        // Fetch all events from native calendar
        const events = await RNCalendarEvents.fetchAllEvents(
          today.utc().toDate(),
          nextMonth.utc().toDate()
        );

        const agendaItems: any = events.reduce((result: CalendarItemMap, event: RNCalendarEvent) => {
          const { startDate, endDate, title, location } = event;

          //
          // converts callback time to agenda format time
          const eventStartDate = moment(
            startDate,
            RCE_TIME_FORMAT
          );

          if (!result[eventStartDate.format("YYYY-MM-DD")]) {
            result[eventStartDate.format("YYYY-MM-DD")] = [];
          }

          result[eventStartDate.format("YYYY-MM-DD")].push({
            date: eventStartDate.utc().toDate(),
            title,
            location,
            start: startDate,
            end: endDate
          });

          return result;
        }, {} as CalendarItemMap);

        this.setState({
          agendaItems: { ...this.state.agendaItems, ...agendaItems }
        });
      }
    } catch (error) {
      Alert.alert('DEV ERROR', error.message);
    }
  }

  mapWonderAppointmentsToAgenda = (appointments: ReadonlyArray<DecoratedAppointment>) => {
    //
    // Attaches calendar items to calendar dates
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
  }

  selectTime = (selectedTime: { hour: string, minute: string }) => {
    this.setState({ selectedTime });
  }

  selectDay = ({ dateString }: { dateString: string }) => {
    this.setState({ selectedDate: dateString });
  }

  renderHeader = () => {
    const { navigation, conversation } = this.props;
    const { first_name, last_name, images = [] } = _.get(conversation, 'partner', {} as User);
    return (
      <Animated.View
        style={{
          alignItems: "center",
          justifyContent: "space-around",
          paddingBottom: 15,
        }}
      >
        <Avatar
          circle
          uri={_.get(images[0], 'url', null)}
        />
        <Text>
          {[first_name, last_name].join(' ')}
        </Text>
      </Animated.View>
    );
  }

  render() {
    const { selected, selectedDate, agendaItems, markedDates } = this.state;
    const today = moment();
    return (
      <Screen>
        {this.renderHeader()}
        <Agenda
          pastScrollRange={0}
          futureScrollRange={1}
          items={agendaItems}
          selected={selectedDate}
          // onCalendarToggled={(calendarOpened: boolean) => { }}
          onDayPress={this.selectDay}
          onDayChange={this.selectDay}
          maxDate={today.clone().add(1, "month").format("YYYY-MM-DD")}
          renderDay={(day?: DateObject, item?: CalendarItem) => {
            if (day) {
              const dayMoment = moment(day.dateString, 'YYYY-MM-DD');
              return (
                <View style={styles.agendaDayContainer}>
                  <Text style={styles.agendaDayDate}>{dayMoment.format("ddd")}</Text>
                  <Text style={styles.agendaDayDay}>{dayMoment.format("MMM D")}</Text>
                </View>
              );
            }
            return <View style={styles.agendaDayContainer} />;
          }}
          renderItem={(item: CalendarItem, firstItemInDay: boolean) => <AgendaDayItem item={item} />}
          renderEmptyDate={() => <View />}
          renderEmptyData={() => (<View style={styles.emptyDataContainer}><Text>No Events</Text></View>)}
          // renderKnob={() => {
          //   return (
          //     <View>
          //       <Text>Show Calendar</Text>
          //     </View>
          //   );
          // }}
          rowHasChanged={(r1: any, r2: any) => r1.text !== r2.text}
          theme={{
            todayTextColor: theme.colors.primary,
            selectedDayBackgroundColor: theme.colors.primary,
            agendaDayTextColor: theme.colors.textColor,
            agendaDayNumColor: theme.colors.textColor,
            agendaTodayColor: theme.colors.textColor,
            agendaKnobColor: theme.colors.primary
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

const styles = StyleSheet.create({
  emptyDataContainer: {
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  agendaDayContainer: {
    marginVertical: 5,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  agendaDayDay: {
    fontSize: 9
  },
  agendaDayDate: {
    fontSize: 16
  }
});
