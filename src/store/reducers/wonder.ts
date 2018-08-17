import { handleActions, createAction, Action } from 'redux-actions';
import Topic from '../../types/topic';
import Proposal from '../../types/proposal';
import Partner from '../../types/partner';
import Appointment, { AppointmentPayload } from '../../types/appointment';

export interface WonderState {
  topics: Topic[];
  proposal: Proposal | null;
  partners: Partner[];
  currentMatch: Proposal | {};
  appointments: Appointment[];
}

const defaultState: WonderState = {
  topics: [],
  proposal: null,
  partners: [],
  currentMatch: {},
  appointments: []
};

export const persistTopics = createAction('PERSIST_TOPICS');
export const persistPartners = createAction('PERSIST_PARTNERS');
export const persistCurrentMatch = createAction('PERSIST_CURRENT_MATCH');
export const persistAppointments = createAction('PERSIST_APPOINTMENTS');
// export const persist

export default handleActions({
  PERSIST_CURRENT_MATCH: (state: WonderState, action: Action<any>) => ({
    ...state,
    currentMatch: action.payload || defaultState.currentMatch
  }),
  PERSIST_TOPICS: (state: WonderState, action: Action<any>): WonderState => ({
    ...state,
    topics: action.payload || defaultState.topics
  }),
  PERSIST_PROPOSAL: (state: WonderState, action: Action<any>) => ({
    ...state,
    proposal: action.payload || defaultState.proposal
  }),
  PERSIST_PARTNERS: (state: WonderState, action: Action<any>) => ({
    ...state,
    partners: action.payload || defaultState.partners
  }),
  PERSIST_APPOINTMENTS: (state: WonderState, action: Action<any>) => ({
    ...state,
    appointments: action.payload || defaultState.appointments
  })
}, defaultState);
