// import ChatResponseMessage from "./chat-message";
import ChatResponseMessage from "./chat-response-message";
import User from "./user";

interface Conversation {
  id: number;
  partner: User;
  last_message: ChatResponseMessage;
  messages: ChatResponseMessage[];
}

interface DecoratedConversation extends Conversation {
  partner: User;
}

export { DecoratedConversation };

export default Conversation;
