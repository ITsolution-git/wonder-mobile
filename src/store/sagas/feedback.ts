import { select, call, put, takeEvery } from 'redux-saga/effects';
import { createAction, Action } from 'redux-actions';
import api from 'src/services/api';

import { Alert } from 'react-native';
import { AxiosResponse } from 'axios';
import WonderAppState from '../../models/wonder-app-state';
import { handleAxiosError } from './utils';

export const SUBMIT_FEEDBACK = 'SUBMIT_FEEDBACK';
export const submitFeedback = createAction(SUBMIT_FEEDBACK);
export function* submitFeedbackSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const response: AxiosResponse = yield call(api, {
      method: 'POST',
      url: '/support_messages',
      data: { support_message: action.payload }
    }, state.user);

    if (response.status === 201) {
      Alert.alert('Submitted!', 'Thanks for submitting feedback!');
    }
  } catch (error) {
    handleAxiosError(error);
  } finally {

  }
}

export function* watchSubmitFeedback() {
  yield takeEvery(SUBMIT_FEEDBACK, submitFeedbackSaga);
}
