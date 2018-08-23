import WonderAppState from "../../models/wonder-app-state";

export const selectCurrentUser = (state: WonderAppState) => state.user.profile;
