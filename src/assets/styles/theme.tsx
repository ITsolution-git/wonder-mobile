import { Dimensions } from 'react-native';
import Color from 'color';

const colors = {
  white: '#FFF',
  black: '#000',
  primary: '#F68E56',
  primaryLight: 'rgb(251, 223, 194)', //'#F9AD81',
  // primaryLight: '#FDE0C1',
  secondary: 'rgb(255, 238, 75)',
  backgroundPrimary: '#ECECEC',
  textColor: '#8E8EAA',
  textColorLight: Color('#8E8EAA').lighten(0.5).toString(),
  cottonCandyPink: '#E7A4CA',
  cottonCandyBlue: '#84CCF1',
};

const transparentNavigationStyles = {
  headerStyle: {
    backgroundColor: colors.white,
    borderBottomWidth: 0,
    elevation: 0
  },
  headerTintColor: colors.textColor,
  headerTitleStyle: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: 'normal',
    color: colors.textColor,
    // textAlign: "center",
    // flex: 1,

  },
  headerBackTitle: null
};

const { width, height, scale, fontScale } = Dimensions.get('window');

export const Device = {
  WIDTH: width,
  HEIGHT: height,
  SCALE: scale,
  FONT_SCALE: fontScale
};

export default {
  colors,
  NavBar: {
    transparent: transparentNavigationStyles
  },
  fonts: {
    primary: 'Poppins'
  },
  borders: {
    radius: 15,
    color: colors.textColor,
    width: 2
  }
};
