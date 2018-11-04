import { handleActions, createAction } from 'redux-actions';
import User from '../../models/user';
import { UserAuth } from '../../models/user-credentials';

export interface UserState {
  readonly profile: User;
  readonly auth: UserAuth;
}

export const initialState: UserState = {
  profile: {

  },
  auth: {
    token: null,
    uid: null,
  }
};

export const addProfileImage = createAction("ADD_PROFILE_IMAGE");

export default handleActions({
  ADD_PROFILE_IMAGE: (state: UserState, action) => {
    return {
      ...state,
      profile: {
        ...state.profile,
        images: [...state.profile.images, { id: 345, url: action.payload.uri, position: 2 }]
      }
    };
  }
  ,
  PERSIST_AUTH: (state: UserState, action) => ({
    ...state,
    auth: {
      token: action.payload.token || initialState.auth.token,
      uid: (action.payload.payload && action.payload.payload.sub) || initialState.auth.uid
    },
  }),
  PERSIST_USER: (state: UserState, action) => ({
    ...state,
    profile: action.payload || initialState.profile
  }),
  LOGOUT_USER: () => initialState
}, initialState);
