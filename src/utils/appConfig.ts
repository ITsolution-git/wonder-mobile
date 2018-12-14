export const DEV: boolean = process.env.NODE_ENV === 'development';

export const PURGE = DEV ? false : false;

export const BUGSNAG_TOKEN: string = '199ec7aaeda101e5fb2983f39ab5538a';
export const INITIAL_HOME_SCREEN: string = DEV ? 'User' : 'Home';
export const INITIAL_PROFILE_SCREEN: string = DEV
  ? 'ProfileView'
  : 'ProfileView';
export const INITIAL_PROFILE_NAV: string = DEV ? '' : '';
