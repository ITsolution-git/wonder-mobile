import theme from 'src/assets/styles/theme';
import { createStackNavigator } from 'react-navigation';
import {
  Login,
  Welcome,
  Register1,
  Register2,
  Register3,
  Register4,
  ProfileCamera,
  ProfileVideo,
} from '../screens';

const RegistrationNavigator = createStackNavigator({
  Welcome: {
    screen: Welcome,
    navigationOptions: {
      header: null
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      title: 'LOGIN',
      ...theme.NavBar.transparent
    }
  },
  Register1: {
    screen: Register1,
    navigationOptions: {
      title: 'CREATE ACCOUNT',
      ...theme.NavBar.transparent
    }
  },
  Register2: {
    screen: Register2,
    navigationOptions: {
      title: 'CREATE ACCOUNT',
      ...theme.NavBar.transparent
    }
  },
  Register3: {
    screen: Register3,
    navigationOptions: {
      title: 'CREATE ACCOUNT',
      ...theme.NavBar.transparent
    }
  },
  Register4: {
    screen: Register4,
    navigationOptions: {
      title: 'YOUR WONDERS',
      ...theme.NavBar.transparent
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
}, {
    initialRouteName: 'Welcome'
  });

export default RegistrationNavigator;
