import { createStackNavigator } from 'react-navigation';
import {
  ChatList,
  ChatScreen,
  ActivityMap,
  AppointmentInvite,
  AppointmentConfirm,
  ActivitySchedule
} from '../screens';
import theme from 'src/assets/styles/theme';

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
<<<<<<< HEAD
        title: 'PICK A WONDER',
        ...theme.NavBar.transparent,
      },
=======
        title: 'FIND A WONDER',
        ...theme.NavBar.transparent
      }
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
    },
    WonderSchedule: {
      screen: ActivitySchedule,
      navigationOptions: {
        // header: null
<<<<<<< HEAD
        title: 'Schedule Your Wonder',
        ...theme.NavBar.transparent,
      },
=======
        title: 'Schedule Your Wonder',
        ...theme.NavBar.transparent
      }
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
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
<<<<<<< HEAD
        title: 'Confirm Your Wonder',
        ...theme.NavBar.transparent,
      },
    },
  },
  {
    initialRouteName: 'ChatList',
  },
=======
        title: 'Confirm Your Wonder',
        ...theme.NavBar.transparent
      }
    }
  },
  {
    initialRouteName: 'ChatList'
  }
>>>>>>> bfc3f5e22871dd12d8e61e1275921293ec192c2a
);

export default ChatNavigator;
