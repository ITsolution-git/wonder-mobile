import NavigatorService from '../../services/navigation';
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { createAction, Action } from 'redux-actions';
import api from '../../services/api';

import { Alert } from 'react-native';

import { persistAppointments } from '../reducers/wonder';
import appointment, { AppointmentState, persistAppointmentData, resetAppointment } from '../reducers/appointment';
import WonderAppState from '../../models/wonder-app-state';
import Appointment from '../../models/appointment';

export const GET_APPOINTMENTS = 'GET_APPOINTMENTS';
export const getAppointments = createAction(GET_APPOINTMENTS);
export function* getAppointmentsSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: Appointment[] } = yield call(api, {
      method: 'GET',
      url: '/appointments'
    }, state.user);

    yield put(persistAppointments(data));
    // yield put(persistUser(data));
    // yield put(resetRegistration());
  } catch (error) {
    if (error.response) {
      Alert.alert('ERROR', JSON.stringify(error.response.data));
    } else {
      console.warn(error);
    }
  } finally {
    // yield put(getUser());
  }
}

export function* watchGetAppointments() {
  yield takeEvery(GET_APPOINTMENTS, getAppointmentsSaga);
}

const serializeAppointment = (appt: AppointmentState) => {
  if (appt && appt.activity && appt.topic && appt.match) {
    return {
      invited_user_id: appt.match.id,
      appointment: {
        name: appt.activity.name,
        location: appt.activity.location.join(', '),
        latitude: appt.activity.latitude,
        longitude: appt.activity.longitude,
        event_at: appt.eventAt,
        topic_id: appt.topic.id
      }
    };
  }
};

export const CREATE_APPOINTMENT = 'CREATE_APPOINTMENT';
export const createAppointment = createAction(CREATE_APPOINTMENT);
export function* createAppointmentSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();
    const body = serializeAppointment(state.appointment);

    const { data }: { data: Appointment[] } = yield call(api, {
      method: 'POST',
      url: '/appointments',
      data: body
    }, state.user);

    yield put(resetAppointment());
    yield put(getAppointments());
    NavigatorService.popToTop();
  } catch (error) {
    if (error.response) {
      Alert.alert('ERROR', JSON.stringify(error.response.data));
    } else {
      console.warn(error.message);
    }
  } finally {
    // yield put(getUser());
  }
}

export function* watchCreateAppointment() {
  yield takeEvery(CREATE_APPOINTMENT, createAppointmentSaga);
}