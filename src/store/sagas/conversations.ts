import { select, call, put, takeEvery } from 'redux-saga/effects';
import { createAction, Action } from 'redux-actions';
import api from '../../services/api';
import WonderAppState from '../../types/wonder-app-state';
import { Alert } from 'react-native';
import Conversation from '../../types/conversation';
import { persistConversations, persistConversation, persistNewMessage } from '../reducers/chat';
import ChatResponseMessage from '../../types/chat-response-message';

//
//
//
//
// get list of all conversations
export const GET_CONVERSATIONS = 'GET_CONVERSATIONS';
export const getConversations = createAction(GET_CONVERSATIONS);
export function* getConversationsSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: Conversation[] } = yield call(api, {
      method: 'GET',
      url: '/conversations'
    }, state.user);

    yield put(persistConversations(data));
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
export function* watchGetConversations() {
  yield takeEvery(GET_CONVERSATIONS, getConversationsSaga);
}

// get chat messages
export const GET_CONVERSATION = 'GET_CONVERSATION';
export const getConversation = createAction(GET_CONVERSATION);
export function* getConversationSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: Conversation[] } = yield call(api, {
      method: 'GET',
      url: `/conversations/${action.payload}/messages`
    }, state.user);
    yield put(persistConversation(data));
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

export function* watchGetConversation() {
  yield takeEvery(GET_CONVERSATION, getConversationSaga);
}
//
//
//
//
// send chat messages
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const sendMessage = createAction(SEND_MESSAGE);
export function* sendMessageSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: ChatResponseMessage } = yield call(api, {
      method: 'POST',
      url: `/conversations/${action.payload.recipient_id}/messages`,
      data: action.payload.data
    }, state.user);
    yield put(persistNewMessage(data));
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

export function* watchSendMessage() {
  yield takeEvery(SEND_MESSAGE, sendMessageSaga);
}