import React from 'react';
import {connect} from 'react-redux';
import StudyList from '../views/study-list';
import * as studyApi from '../../api/study-api';
import store from '../../store';


const StudyListContainer = React.createClass({
  componentDidMount: function() {
    studyApi.getStudies();
  },
  render: function() {
    return (
      <StudyList {...this.props} />
    );
  }
});

const mapStateToProps = function(store) {
  return {
    studies: store.studyState.studies
  };
};

export default connect(mapStateToProps)(StudyListContainer);