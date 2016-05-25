import * as types from './action-types';


export function getLoginSuccess(user) {
  return {
    type: types.LOGIN_SUCCESS,
    user
  };
}

export function getLogoutSuccess() {
  return {
    type: types.LOGOUT_SUCCESS
  };
}
