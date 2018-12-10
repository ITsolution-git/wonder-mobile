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
import { INITIAL_PROFILE_SCREEN } from '@utils';

import TabIcon from 'src/views/components/tabs/secondary-tab-icon';
import theme from 'src/assets/styles/theme';

// import SecondaryTabIcon from 'src/views/components/tab/secondary-tab-icon';

function hideTabsForNestedRoutes({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationRoute>;
}) {
  if (navigation.state.index >= 1) {
    return {
      tabBarVisible: false
    };
  }
  return {
    tabBarVisible: true
  };
}

// Manages Profile Stack
const ProfileNavigator = createStackNavigator(
  {
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
        title: 'Pick Your Wonders',
        ...theme.NavBar.transparent
      }
    },
    ProfilePreferences: {
      screen: ProfilePreferences,
      navigationOptions: {
        title: 'Preferences',
        ...theme.NavBar.transparent
        // header: null,
      }
    },
    ProfileCamera: {
      screen: ProfileCamera,
      navigationOptions: {
        title: 'Profile Selfie',
        ...theme.NavBar.transparent
      }
    },
    ProfileVideo: {
      screen: ProfileVideo,
      navigationOptions: {
        title: 'Vibe Video',
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
  {
    initialRouteName: INITIAL_PROFILE_SCREEN
  }
);

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
});

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

const UserNavigator = createMaterialTopTabNavigator(
  {
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
    }
  },
  {
    swipeEnabled: false,
    tabBarPosition: 'top',
    tabBarOptions: {
      allowFontScaling: false,
      style: {
        backgroundColor: '#FFF',
        elevation: 0
      },
      indicatorStyle: {
        backgroundColor: theme.colors.primary
      },
      activeTintColor: theme.colors.primary,
      inactiveTintColor: theme.colors.textColor
    }
  }
);

export default UserNavigator;
