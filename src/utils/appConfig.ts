export const DEV: boolean = process.env.NODE_ENV === 'development';

export const PURGE = DEV ? false : false;

export const BUGSNAG_TOKEN: string = 'b11b0680cca2e6736fcd9a0ba94ae172';
export const INITIAL_HOME_SCREEN: string = DEV ? 'Home' : 'Home';
export const INITIAL_PROFILE_SCREEN: string = DEV
  ? 'ProfileView'
  : 'ProfileView';
export const INITIAL_PROFILE_NAV: string = DEV ? '' : '';
