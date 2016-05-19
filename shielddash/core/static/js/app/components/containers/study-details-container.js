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
      <StudyDetails {...this.props.study} totals={this.props.totals} />
    );
  }
});

const mapStateToProps = function(store) {
  return {
    study: store.studyState.study,
    totals: store.studyState.totals
  };
}

export default connect(mapStateToProps)(StudyDetailsContainer);