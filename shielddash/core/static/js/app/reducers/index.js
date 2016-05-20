import {combineReducers} from 'redux';

// Individual reducers
import studyReducer from './study-reducer';
import loginReducer from './login-reducer';

var reducers = combineReducers({
  studyState: studyReducer,
  loginState: loginReducer
});

export default reducers;