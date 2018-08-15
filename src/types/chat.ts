import User from "./user";
export interface ChatUser extends Partial<User> {
  first_name: string;
}

interface Chat {
  partner: ChatUser;
}

export default Chat;
