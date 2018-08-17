import WonderAppState from "../../types/wonder-app-state";

export const selectCurrentUser = (state: WonderAppState) => state.user.profile;
