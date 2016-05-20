import axios from 'axios';
import store from '../store';
import {getStudiesSuccess, getStudySuccess} from '../actions/study-actions';

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
  return axios.get(endpoints.GET_STUDIES, {headers: headers}).then(response => {
    store.dispatch(getStudiesSuccess(response.data));
    return response;
  }).catch(err => {
    console.error(err);
  });
}

// Fetch specific study.
export function getStudy(studyId) {
  return axios.get(endpoints.GET_STUDY + studyId + '/', {headers: headers}).then(response => {
    store.dispatch(getStudySuccess(response.data));
    return response;
  }).catch(err => {
    console.error(err);
  });
}
