export const DEV: boolean = process.env.NODE_ENV === "development";

export const BUGSNAG_TOKEN: string = "38c3267508acb58c6e39fab639bfad76";
export const INITIAL_HOME_SCREEN: string = DEV ? "User" : "Home";
export const INITIAL_PROFILE_SCREEN: string = DEV
  ? "ProfileView"
  : "ProfileView";
export const INITIAL_PROFILE_NAV: string = DEV ? "ProfilePreferences" : "";
