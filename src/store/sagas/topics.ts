import { call, put, takeEvery, select } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import { Action } from 'redux';
import axios from 'axios';
import { persistTopics } from '../reducers/wonder';
import api from '../../services/api';

export const GET_TOPICS = 'GET_TOPICS';
export const getTopics = createAction(GET_TOPICS);
export function* getTopicsSaga(action: Action) {
  try {
    const response = yield call(api, {
      url: '/topics'
    });
    yield put(persistTopics(response.data));
  } catch (error) {
    console.warn(error);
  }
}

export function* watchGetTopics() {
  yield takeEvery(GET_TOPICS, getTopicsSaga);
}

export const SUGGEST_TOPIC = 'SUGGEST_TOPIC';
export const suggestTopic = createAction(SUGGEST_TOPIC);
export function* suggestTopicSaga(action: Action) {
  try {
    yield select();
    // yield put();
  } catch (error) {

  }
}

export function* watchSuggestTopicSaga() {
  yield takeEvery(SUGGEST_TOPIC, suggestTopicSaga);
}