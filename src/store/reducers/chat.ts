import { handleActions, createAction, Action } from "redux-actions";
import Conversation from "../../models/conversation";
import Activity from "../../models/activity";
import ActivityDetails from "../../models/activity-details";

export interface ChatState {
  readonly conversations: Conversation[];
  readonly conversation: Conversation | null;
  readonly activities: Activity[];
  readonly activity: ActivityDetails | null;
}

export const initialState: ChatState = {
  conversations: [],
  conversation: [],
  activities: [],
  activity: null
};

export const persistConversations = createAction("PERSIST_CONVERSATIONS");
export const persistConversation = createAction("PERSIST_CONVERSATION");
export const persistNewMessage = createAction("PERSIST_NEW_MESSAGE");
export const persistActivities = createAction("PERSIST_ACTIVITIES");
export const persistActivity = createAction("PERSIST_ACTIVITY");

export const persistNewChatMessage = createAction("PERSIST_NEW_CHAT_MESSAGE");
export default handleActions(
  {
    PERSIST_NEW_CHAT_MESSAGE: (state = initialState, action: Action<any>) => {

      return {
        ...state,
        conversation: {
          ...state.conversation,
          messages: [action.payload, ...state.conversation.messages]
        }
      };
    },
    PERSIST_CONVERSATIONS: (state = initialState, action: Action<any>) => {
      return {
        ...state,
        conversations: action.payload
      };
    },
    PERSIST_CONVERSATION: (state: ChatState, action: Action<any>) => {
      return {
        ...state,
        conversation: action.payload
      };
    },
    PERSIST_ACTIVITY: (state: ChatState, action: Action<any>) => {
      return {
        ...state,
        activity: action.payload
      };
    },
    PERSIST_ACTIVITIES: (state: ChatState, action: Action<any>) => {
      return {
        ...state,
        activities: action.payload
      };
    },
    LOGOUT_USER: () => initialState
  },
  initialState
);
