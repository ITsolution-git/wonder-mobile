import _ from 'lodash';
import { createSelector, OutputSelector } from 'reselect';
import WonderAppState from '../../types/wonder-app-state';
import Appointment, { DecoratedAppointment, AppointmentUser } from '../../types/appointment';
import { selectCurrentUser } from './user';
import User from '../../types/user';
import moment from 'moment-timezone';
import { isAppointmentBeforeToday, isAppointmentAfterToday } from '../../utils/appointment';

const allAppointments = (state: WonderAppState) => state.wonder.appointments;

const decorateAppointment = (appointment: Appointment, me: User): DecoratedAppointment | undefined => {
  if (appointment) {
    const result: DecoratedAppointment = {
      ...appointment,
      me,
      match: appointment.users.find((user: AppointmentUser) => user.id !== me.id)
    };

    return result;
  }
  return undefined;
};

export const selectUpcomingAppointments:
  OutputSelector<WonderAppState, Array<DecoratedAppointment | undefined>, Function> = createSelector(
    [selectCurrentUser, allAppointments],
    (currentUser, appointments) => {
      return _.sortBy(appointments, 'event_at')
        .map((a: Appointment) => decorateAppointment(a, currentUser))
        .filter(isAppointmentAfterToday);

    }
  );

export const selectPastAppointments = createSelector(
  [selectCurrentUser, allAppointments],
  (currentUser, appointments) => {
    return appointments
      .map((a: Appointment) => decorateAppointment(a, currentUser))
      .filter(isAppointmentBeforeToday);
  }
);
