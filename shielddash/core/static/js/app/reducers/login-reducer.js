import * as types from '../actions/action-types';

const initialState = {
  user: {
    name: '',
    email: '',
    token: ''
  }
};

const loginReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {user: action.user});
    case types.LOGOUT_SUCCESS:
      return Object.assign({}, state, {user: null});
  }

  return state;
}

export default loginReducer;
