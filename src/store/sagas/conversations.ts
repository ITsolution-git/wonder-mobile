import { select, call, put, takeEvery } from "redux-saga/effects";
import { createAction, Action } from "redux-actions";
import api from "../../services/api";

import { Alert } from "react-native";

import {
  persistConversations,
  persistConversation,
  persistNewMessage
} from "../reducers/chat";
import Conversation from "../../models/conversation";
import WonderAppState from "../../models/wonder-app-state";
import ChatResponseMessage from "../../models/chat-response-message";
import navigation from "../../services/navigation";

// Get all conversations (Chats)
export const GET_CONVERSATIONS = "GET_CONVERSATIONS";
export const getConversations = createAction(GET_CONVERSATIONS);
export function* getConversationsSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: Conversation[] } = yield call(
      api,
      {
        method: "GET",
        url: "/conversations"
      },
      state.user
    );

    yield put(persistConversations(data));
  } catch (error) {
    if (error.response) {
      Alert.alert(
        `HTTP ${error.response.status}`,
        JSON.stringify(error.response.data)
      );
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

// Get the content of a single conversation
export const GET_CONVERSATION = "GET_CONVERSATION";
export const getConversation = createAction(GET_CONVERSATION);
export function* getConversationSaga(action: Action<any>) {
  //   <---------------------Commented out so I can get to the schedule wonder chat action button Commenter:stephen
  //
  // try {
  const { id, successRoute } = action.payload;
  //   const state: WonderAppState = yield select();
  //   const { data }: { data: Conversation[] } = yield call(api, {
  //     method: 'GET',
  //     url: `/conversations/${id}/messages`
  //   }, state.user);
  //   yield put(persistConversation(data));
  //   if (successRoute) {
  //     navigation.navigate(successRoute);
  //   }
  // } catch (error) {
  //   if (error.response) {
  //     Alert.alert(`HTTP ${error.response.status}`, JSON.stringify(error.response.data));
  //   } else {
  //     console.warn(error);
  //   }
  // } finally {
  //   // yield put(getUser());
  // }

  yield put(
    persistConversation(
      //<-----fake data so I can get tot he schedule wonder chat screen Commenter:stephen
      [{ parter: { id: 8 } }]
    )
  );
  if (successRoute) {
    navigation.navigate(successRoute);
  }
}

export function* watchGetConversation() {
  yield takeEvery(GET_CONVERSATION, getConversationSaga);
}

// send chat messages
export const SEND_MESSAGE = "SEND_MESSAGE";
export const sendMessage = createAction(SEND_MESSAGE);
export function* sendMessageSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: ChatResponseMessage } = yield call(
      api,
      {
        method: "POST",
        url: `/conversations/${action.payload.recipient_id}/messages`,
        data: action.payload
      },
      state.user
    );
    yield put(persistNewMessage(data));
  } catch (error) {
    if (error.response) {
      Alert.alert(
        `HTTP ${error.response.status}`,
        JSON.stringify(error.response.data)
      );
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

// ghost contact
export const GHOST_CONTACT = 'GHOST_CONTACT';
export const ghostContact = createAction(GHOST_CONTACT);
export function* ghostContactSaga(action: Action<any>) {
  //Alert.alert(JSON.stringify(action.payload));
  try {
    const state: WonderAppState = yield select();

    yield call(api, {
      method: 'DELETE',
      url: `/conversations/${action.payload.id}/ghost`,
    }, state.user);
  } catch (error) {
    if (error.response) {
      Alert.alert(`HTTP ${error.response.status}`, JSON.stringify(error.response.data));
    } else {
      console.warn(error);
    }
  } finally {
    // yield put(getUser());
  }
}

export function* watchGhostContact() {
  yield takeEvery(GHOST_CONTACT, ghostContactSaga);
}
