import _ from 'lodash';
import WonderAppState from "src/models/wonder-app-state";
import { createSelector } from "reselect";
import Conversation, { DecoratedConversation } from "src/models/conversation";
import { selectCurrentUser } from "./user";
import User from "src/models/user";
import ChatResponseMessage from "src/models/chat-response-message";
import GiftedChatMessage from "src/models/chat-message";

const selectConversation = (state: WonderAppState) => state.chat.conversation;

export const getDecoratedConversation = createSelector([selectCurrentUser, selectConversation],
  (currentUser, conversation): Conversation | null => {
    return conversation;
  });

export const decorateMessagesForGiftedChat =
  (currentUser: User, conversation: Conversation | null): DecoratedConversation | undefined => {
    if (conversation) {
      const messages: ChatResponseMessage[] = _.get(conversation, 'messages', []);
      return {
        ...conversation,
        giftedChatMessages: messages.map((message: ChatResponseMessage) => {
          const owner: User = message.sender_id === currentUser.id ? currentUser : conversation.partner;
          const o: GiftedChatMessage = {
            _id: message.id,
            text: message.body,
            createdAt: new Date(message.sent_at),
            user: {
              _id: message.sender_id,
              name: owner.first_name,
              avatar: owner.images && owner.images.length ? owner.images[0].url : undefined
            }
          };
          return o;
        })
      };
    }
    return undefined;
  };
