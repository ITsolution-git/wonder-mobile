import { handleActions, createAction, Action } from 'redux-actions';
import Conversation from '../../types/conversation';
import Activity from '../../types/activity';
import ActivityDetails from '../../types/activity-details';
import User from '../../types/user';
import Topic from '../../types/topic';

export interface AppointmentState {
  readonly match?: Partial<User> | null;
  readonly activity?: ActivityDetails | null;
  readonly eventAt?: Date | null;
  readonly topic?: Topic | null;
}

export const initialState: AppointmentState = {
  match: null,
  activity: null,
  eventAt: null,
  topic: null
};

export const persistAppointmentData = createAction('PERSIST_APPOINTMENT_DATA');
export const resetAppointment = createAction('RESET_APPOINTMENT');

export default handleActions({
  PERSIST_APPOINTMENT_DATA: (state: AppointmentState, action: Action<any>) => ({
    ...state,
    ...action.payload
  }),
  RESET_APPOINTMENT: () => initialState,
  LOGOUT_USER: () => initialState
}, initialState);
