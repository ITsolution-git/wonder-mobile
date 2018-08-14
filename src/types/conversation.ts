// import ChatResponseMessage from "./chat-message";
import ChatResponseMessage from "./chat-response-message";
import User from "./user";

interface Conversation {
  id: number;
  partner: Partial<User>;
  last_message: Partial<ChatResponseMessage>;
  messages: [Partial<ChatResponseMessage>];
}

export default Conversation;
