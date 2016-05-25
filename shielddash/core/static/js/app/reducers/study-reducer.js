import * as types from '../actions/action-types';


const channel = {
  medium: {},
  weak: {},
  aggressive: {},
  ut: {}
};

const initialState = {
  isFetching: false,
  status: 200,
  studies: [],
  study: {
    channels: {
      release: channel,
      aurora: channel,
      beta: channel
    }
  },
  totals: {
    release: {},
    beta: {},
    aurora: {},
    all: {}
  }
};

const studyReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.GETTING_STUDIES:
      return Object.assign({}, state, {isFetching: true});
    case types.GET_STUDIES_SUCCESS:
      return Object.assign({}, state, {isFetching: false, studies: action.studies.studies});
    case types.GET_STUDIES_FAILURE:
      return Object.assign({}, state, {isFetching: false, status: action.status});

    case types.GETTING_STUDY:
      return Object.assign({}, state, {isFetching: true});
    case types.GET_STUDY_SUCCESS:
      return Object.assign({}, state, {isFetching: false, study: action.study, totals: action.totals});
    case types.GET_STUDY_FAILURE:
      return Object.assign({}, state, {isFetching: false, status: action.status});
  }

  return state;
}

export default studyReducer;
