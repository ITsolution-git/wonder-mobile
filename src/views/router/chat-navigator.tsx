import { createStackNavigator } from "react-navigation";
import {
  ChatList,
  ChatScreen,
  ActivityMap,
  AppointmentInvite,
  AppointmentConfirm
} from '../screens';
import theme from "src/assets/styles/theme";

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
  },
  AppointmentInvite: {
    screen: AppointmentInvite,
    navigationOptions: {
      ...theme.NavBar.transparent
    }
  },
  AppointmentConfirm: {
    screen: AppointmentConfirm,
    navigationOptions: {
      title: 'Confirm Your Wonder',
      ...theme.NavBar.transparent
    }
  }
});

export default ChatNavigator;
