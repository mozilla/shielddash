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
    isFetching: store.studyState.isFetching,
    studies: store.studyState.studies,
    status: store.studyState.status
  };
};

export default connect(mapStateToProps)(StudyListContainer);
