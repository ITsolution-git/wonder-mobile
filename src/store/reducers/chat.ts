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
  conversation: null,
  activities: [],
  activity: null
};

export const persistConversations = createAction("PERSIST_CONVERSATIONS");
export const persistConversation = createAction("PERSIST_CONVERSATION");
export const persistNewMessage = createAction("PERSIST_NEW_MESSAGE");
export const persistActivities = createAction("PERSIST_ACTIVITIES");
export const persistActivity = createAction("PERSIST_ACTIVITY");
export default handleActions(
  {
    PERSIST_CONVERSATIONS: (state: ChatState, action: Action<any>) => ({
      ...state,
      conversations: action.payload || initialState.conversations
    }),
    PERSIST_CONVERSATION: (state: ChatState, action: Action<any>) => ({
      ...state,
      conversation: action.payload || initialState.conversation
    }),
    PERSIST_ACTIVITY: (state: ChatState, action: Action<any>) => ({
      ...state,
      activity: action.payload || initialState.activity
    }),
    PERSIST_ACTIVITIES: (state: ChatState, action: Action<any>) => ({
      ...state,
      activities: action.payload || initialState.activities
    }),
    LOGOUT_USER: () => initialState
  },
  initialState
);
