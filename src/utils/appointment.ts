import Appointment from "../types/appointment";
import moment from 'moment-timezone';

export const isAppointmentBeforeToday = (appointment?: Appointment): boolean => {
  if (appointment && appointment.event_at) {
    const now = moment().startOf('day');
    const eventAt = moment(appointment.event_at);
    return eventAt.isBefore(now);
  }
  return false;
};

export const isAppointmentAfterToday = (appointment?: Appointment): boolean =>
  !isAppointmentBeforeToday(appointment);
