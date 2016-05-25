import React from 'react';
import {connect} from 'react-redux';
import PercentToggle from '../views/percent-toggle';
import store from '../../store';
import {showPercentValues, hidePercentValues} from '../../actions/study-actions';


const PercentToggleContainer = React.createClass({
  _togglePercentage: function(evt) {
    let study = document.querySelector('.study-wrapper');
    if (study) {
      study.querySelector('.percent-toggle .switch')
           .classList.toggle('active');
      study.classList.toggle('show-percentage');

      if (study.classList.contains('show-percentage')) {
        store.dispatch(showPercentValues());
      } else {
        store.dispatch(hidePercentValues());
      }
    }
  },
  render: function() {
    return (
      <PercentToggle switch={{from: 'users', to: '%'}}
       showPercentage={this.props.showPercentage} doToggle={this._togglePercentage} />
    );
  }
});

const mapStateToProps = function(store) {
  return {
    showPercentage: store.studyState.showPercentage
  };
};

export default connect(mapStateToProps)(PercentToggleContainer);
