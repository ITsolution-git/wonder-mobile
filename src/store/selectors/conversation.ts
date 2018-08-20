import WonderAppState from "src/types/wonder-app-state";
import { createSelector } from "reselect";
import Conversation, { DecoratedConversation } from "src/types/conversation";
import { selectCurrentUser } from "./user";
import User from "src/types/user";
import ChatResponseMessage from "src/types/chat-response-message";
import GiftedChatMessage from "src/types/chat-message";

const selectConversation = (state: WonderAppState) => state.chat.conversation;

export const getDecoratedConversation = createSelector([selectCurrentUser, selectConversation],
  (currentUser, conversation): DecoratedConversation => {
    return decorateMessagesForGiftedChat(currentUser, conversation);
  });

export const decorateMessagesForGiftedChat = (currentUser: User, conversation: Conversation): DecoratedConversation => {
  return {
    ...conversation,
    giftedChatMessages: conversation.messages.map((message: ChatResponseMessage) => {
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
};
