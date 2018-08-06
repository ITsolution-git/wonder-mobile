import { createStackNavigator } from "react-navigation";
import {
  ChatList,
  ChatScreen,
  ActivityMap
} from '../screens';
import theme from "../../assets/styles/theme";

const ChatNavigator = createStackNavigator({
  ChatList: {
    screen: ChatList,
    navigationOptions: {
      header: null
    }
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      ...theme.NavBar.transparent
    }
  },
  WonderMap: {
    screen: ActivityMap,
    navigationOptions: {
      // header: null
      title: 'FIND A WONDER',
      ...theme.NavBar.transparent
    }
  }
});

export default ChatNavigator;