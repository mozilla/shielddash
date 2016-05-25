import React from 'react';
import {connect} from 'react-redux';
import StudyDetails from '../views/study-details';
import * as studyApi from '../../api/study-api';


const StudyDetailsContainer = React.createClass({
  componentDidMount: function() {
    let studyId = this.props.params.studyId;
    studyApi.getStudy(studyId);
  },
  render: function() {
    return (
      <StudyDetails {...this.props} />
    );
  }
});

const mapStateToProps = function(store) {
  return {
    isFetching: store.studyState.isFetching,
    study: store.studyState.study,
    totals: store.studyState.totals,
    status: store.studyState.status
  };
}

export default connect(mapStateToProps)(StudyDetailsContainer);
