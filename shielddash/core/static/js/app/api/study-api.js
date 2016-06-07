import axios from 'axios';
import store from '../store';
import {
  getStudiesFetching, getStudiesSuccess, getStudiesFailure,
  getStudyFetching, getStudySuccess, getStudyFailure
} from '../actions/study-actions';

const devEndpoints = {
  GET_STUDIES: 'http://localhost:8000/studies/',
  GET_STUDY: 'http://localhost:8000/studies/'
};

const prodEndpoints = {
  GET_STUDIES: 'https://shielddash.herokuapp.com/studies/',
  GET_STUDY: 'https://shielddash.herokuapp.com/studies/'
}

const endpoints = __PROD_API__ ? prodEndpoints : devEndpoints;

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
  }).catch(response => {
    console.error(response);
    store.dispatch(getStudiesFailure(response));
    return response;
  });
}

// Fetch specific study.
export function getStudy(studyId) {
  store.dispatch(getStudyFetching());

  return axios.get(endpoints.GET_STUDY + studyId + '/', {headers}).then(response => {
    store.dispatch(getStudySuccess(response.data));
    return response;
  }).catch(response => {
    console.error(response);
    store.dispatch(getStudyFailure(response));
    return response;
  });
}
