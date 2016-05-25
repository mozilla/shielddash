import axios from 'axios';
import store from '../store';
import {
  getStudiesFetching, getStudiesSuccess, getStudiesFailure,
  getStudyFetching, getStudySuccess, getStudyFailure
} from '../actions/study-actions';

const mockEndpoints = {
  GET_STUDIES: 'http://localhost:3009/studies',
  GET_STUDY: 'http://localhost:3009/studys/'
};

const prodEndpoints = {
  GET_STUDIES: 'https://shielddash.herokuapp.com/studies/',
  GET_STUDY: 'https://shielddash.herokuapp.com/studies/'
}

// TODO: Check node environment to set this.
const endpoints = process.env.NODE_ENV === 'dev' ? mockEndpoints : prodEndpoints;

// Auth token from LS.
let jwt = localStorage.getItem('user_token');
let headers = {
  Authorization: 'JWT ' + jwt
}

// Fetch list of studies.
export function getStudies() {
  store.dispatch(getStudiesFetching());

  return axios.get(endpoints.GET_STUDIES, {headers}).then(response => {
    store.dispatch(getStudiesSuccess(response.data));
    return response;
  }).catch(err => {
    console.error(err);
    store.dispatch(getStudiesFailure(err.status));
    return err;
  });
}

// Fetch specific study.
export function getStudy(studyId) {
  store.dispatch(getStudyFetching());

  return axios.get(endpoints.GET_STUDY + studyId + '/', {headers}).then(response => {
    store.dispatch(getStudySuccess(response.data));
    return response;
  }).catch(err => {
    console.error(err);
    store.dispatch(getStudyFailure(err.status));
    return err;
  });
}
