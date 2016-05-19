import * as types from './action-types';
import {studyFields} from '../constants';


export function getStudiesSuccess(studies) {
  return {
    type: types.GET_STUDIES_SUCCESS,
    studies
  };
}

const getChannelTotals = function(study, channel) {
  // Use function.apply() to initialize the return obj with values of 0.
  // example: {completed: 0, left_study: 0, seen1: 0,...}
  var totals = (function() {
    let result = {};
    for (let i = 0; i < arguments.length; i++) {result[arguments[i]] = 0;}
    return result;
  }).apply(null, studyFields);

  Object.keys(study.channels[channel]).map(function(method) {
    studyFields.map(function(field) {
      totals[field] += study.channels[channel][method][field];
    });
  });

  return totals;
}

const getAllTotals = function(study) {
  let result = {};
  let calcFieldTotal = function(field) {
    return getChannelTotals(study, 'release')[field] + getChannelTotals(study, 'beta')[field] + getChannelTotals(study, 'aurora')[field];
  };

  studyFields.map(function(field) {
    result[field] = calcFieldTotal(field);
  });

  return result;
}

export function getStudySuccess(study) {
  let totals = {
    release: getChannelTotals(study, 'release'),
    beta: getChannelTotals(study, 'beta'),
    aurora: getChannelTotals(study, 'aurora'),
    all: getAllTotals(study)
  };

  return {
    type: types.GET_STUDY_SUCCESS,
    study,
    totals
  };
}