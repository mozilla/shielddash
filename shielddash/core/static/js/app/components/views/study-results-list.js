import React from 'react';
import {studyFields, isFieldFaded} from '../../constants';


const StudyResultsRow = React.createClass({
  render: function() {
    if (this.props.isTotalsRow) {
      return (
        <li className="study-results-row study-channel-totals-row">
          <span />
          {studyFields.map(field => {
            return (
              <span className={isFieldFaded(field) ? 'study-field-faded' : ''}>
                {this.props.totals[field]}
              </span>
            );
          })}
        </li>
      );
    }
    return (
      <li className="study-results-row">
        <span>{this.props.type}</span>
        {studyFields.map(field => {
          let count = this.props.channel[this.props.type][field];
          let percent = Math.round(count / this.props.totals[field] * 100);
          return (
            <span className={isFieldFaded(field) ? 'study-field-faded' : ''}>
              <b className="count">{count}</b>
              <b className="percent">{percent + '%'}</b>
            </span>
          );
        })}
      </li>
    );
  }
});

export default function(props) {
  return (
    <ul>
      {Object.keys(props.channel).map(type => {
        return (
          <StudyResultsRow channel={props.channel} type={type} totals={props.totals} />
        );
      })}
      <StudyResultsRow isTotalsRow={true} totals={props.totals} />
    </ul>
  );
}
