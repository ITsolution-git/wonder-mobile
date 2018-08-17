import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  NavigationScreenProp,
  NavigationRoute
} from 'react-navigation';

import {
  AppointmentView,
  ProfileView,
  ProfileEdit,
  ProfileMedia,
  ProfilePreferences,
  ProfileWonders,
  UpcomingAppointments,
  PastAppointments,
  ProfileCamera,
  ProfileVideo,
  Feedback
} from '../screens';

import TabIcon from '../components/tabs/secondary-tab-icon';
import theme from '../../assets/styles/theme';

// import SecondaryTabIcon from '../components/tab/secondary-tab-icon';

function hideTabsForNestedRoutes({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }) {
  if (navigation.state.index >= 1) {
    return {
      tabBarVisible: false,
    };
  }
  return {
    tabBarVisible: true,
  };
}

// Manages Profile Stack
const ProfileNavigator = createStackNavigator({
  ProfileView: {
    screen: ProfileView
  },
  ProfileEdit: {
    screen: ProfileEdit,
    navigationOptions: {
      title: 'Profile',
      ...theme.NavBar.transparent
    }
  },
  ProfileMedia: {
    screen: ProfileMedia,
    navigationOptions: {
      header: null
    }
  },
  ProfileWonders: {
    screen: ProfileWonders,
    navigationOptions: {
      title: 'Wonders',
      ...theme.NavBar.transparent
    }
  },
  ProfilePreferences: {
    screen: ProfilePreferences,
    navigationOptions: {
      title: 'Preferences',
      ...theme.NavBar.transparent
    }
  },
  ProfileCamera: {
    screen: ProfileCamera,
    navigationOptions: {
      header: null
    }
  },
  ProfileVideo: {
    screen: ProfileVideo,
    navigationOptions: {
      title: 'Profile Selfie',
      ...theme.NavBar.transparent
    }
  },
  Feedback: {
    screen: Feedback,
    navigationOptions: {
      title: 'Contact Us',
      ...theme.NavBar.transparent
    }
  }
},
  {});

const UpcomingAppointmentsNavigator = createStackNavigator({
  UpcomingAppointments: {
    screen: UpcomingAppointments,
    navigationOptions: { header: null }
  },
  UpcomingAppointmentView: {
    screen: AppointmentView,
    navigationOptions: {
      ...theme.NavBar.transparent
    }
  }
}, );

const PastAppointmentsNavigator = createStackNavigator({
  PastAppointments: {
    screen: PastAppointments,
    navigationOptions: { header: null }
  },
  PastAppointmentView: {
    screen: AppointmentView,
    navigationOptions: {
      ...theme.NavBar.transparent
    }
  }
});

const UserNavigator = createMaterialTopTabNavigator({
  Profile: {
    screen: ProfileNavigator,
    navigationOptions: hideTabsForNestedRoutes
  },
  Past: {
    screen: PastAppointmentsNavigator,
    navigationOptions: hideTabsForNestedRoutes
  },
  Upcoming: {
    screen: UpcomingAppointmentsNavigator,
    navigationOptions: hideTabsForNestedRoutes
  },
}, {
    swipeEnabled: false,
    tabBarPosition: 'top',
    tabBarOptions: {
      allowFontScaling: false,
      style: {
        backgroundColor: '#FFF',
        elevation: 0
      },
      indicatorStyle: {
        backgroundColor: theme.colors.primary,
      },
      activeTintColor: theme.colors.primary,
      inactiveTintColor: theme.colors.textColor,
    },
  });

export default UserNavigator;
