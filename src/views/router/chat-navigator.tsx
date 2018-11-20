import { createStackNavigator } from "react-navigation";
import {
  ChatList,
  ChatScreen,
  ActivityMap,
  AppointmentInvite,
  AppointmentConfirm,
  ActivitySchedule,
} from "../screens";
import theme from "src/assets/styles/theme";

const ChatNavigator = createStackNavigator(
  {
    ChatList: {
      screen: ChatList,
      navigationOptions: {
        header: null,
      },
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        ...theme.NavBar.transparent,
      },
    },
    WonderMap: {
      screen: ActivityMap,
      navigationOptions: {
        // header: null
        title: "PICK A WONDER",
        ...theme.NavBar.transparent,
      },
    },
    WonderSchedule: {
      screen: ActivitySchedule,
      navigationOptions: {
        // header: null
        title: "Schedule Your Wonder",
        ...theme.NavBar.transparent,
      },
    },
    AppointmentInvite: {
      screen: AppointmentInvite,
      navigationOptions: {
        ...theme.NavBar.transparent,
      },
    },
    AppointmentConfirm: {
      screen: AppointmentConfirm,
      navigationOptions: {
        title: "Confirm Your Wonder",
        ...theme.NavBar.transparent,
      },
    },
  },
  {
    initialRouteName: "ChatList",
  },
);

export default ChatNavigator;
