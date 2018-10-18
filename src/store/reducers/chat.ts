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
  activity: null,
  newOutgoingMessage: {}
};

export const persistConversations = createAction("PERSIST_CONVERSATIONS");
export const persistConversation = createAction("PERSIST_CONVERSATION");
export const persistNewMessage = createAction("PERSIST_NEW_MESSAGE");
export const persistActivities = createAction("PERSIST_ACTIVITIES");
export const persistActivity = createAction("PERSIST_ACTIVITY");

export const persistNewChatMessage = createAction("PERSIST_NEW_CHAT_MESSAGE");
export const persistNewReceivedMessage = createAction("PERSIST_NEW_RECEIVED_MESSAGE");
export default handleActions(
  {
    PERSIST_NEW_RECEIVED_MESSAGE: (state = initialState, action: Action<any>) => {

      const newConvos = state.conversations.map((c) => {
        if (c.partner) {
          if (c.partner.id && c.partner.id === action.payload.sender.id) {
            c.last_message = action.payload;
          }
        }

        return c;
      });
      // check if conversation exists
      if (state.conversation) {
        return {
          ...state,
          conversation: {
            ...state.conversation,
            messages: [action.payload, ...state.conversation.messages]
          },
          conversations: newConvos
        };
      } else {
        // check if conversation exists by conv id
        // if it does just update convos
        // if not create one

      }
    },
    PERSIST_NEW_CHAT_MESSAGE: (state = initialState, action: Action<any>) => {
      const message = {
        id: Math.floor(1000 + Math.random() * 9000),
        body: action.payload.message.text,
        state: "delivered",
        recipient: action.payload.recipient,
        sender: action.payload.sender,
        delivered_at: new Date().toISOString(),
        sent_at: new Date(action.payload.message.createdAt).toISOString(),
        read_at: null,
        aasm_state: "delivered"
      };
      const newConversations = state.conversations.map((c) => {
        if (c.id === action.payload.conversation_id) {
          c.last_message = message;
        }
        return c;
      });

      return {
        ...state,
        conversation: {
          ...state.conversation,
          messages: [message, ...state.conversation.messages]
        },
        newOutgoingMessage: action.payload,
        conversations: newConversations
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

// getting from new message

// payload:
// createdAt: Thu Oct 18 2018 11:10:32 GMT-0700 (Pacific Daylight Time) {}
// text: "Something"
// user: {_id: 743}
// _id: "e676138e-6418-4d74-8f56-f839a8c40696"
// __proto__: Object
// type: "PERSIST_NEW_CHAT_MESSAGE"
// __proto__: Object

// getting from saga
