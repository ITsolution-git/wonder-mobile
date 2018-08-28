import ChatResponseMessage from "./chat-response-message";
import User from "./user";
import GiftedChatMessage from "./chat-message";

interface Conversation {
  id: number;
  partner: User;
  last_message: ChatResponseMessage;
  messages: ChatResponseMessage[];
}

interface DecoratedConversation extends Conversation {
  giftedChatMessages: GiftedChatMessage[];
}

interface ConversationNewMessage {
  conversation_id: number;
  message: {
    body: string;
  };
}

export { DecoratedConversation, ConversationNewMessage };

export default Conversation;
