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
          return (
            <span className={isFieldFaded(field) ? 'study-field-faded' : ''}>
              {this.props.channel[this.props.type][field]}
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
          <StudyResultsRow channel={props.channel} type={type} />
        );
      })}
      <StudyResultsRow isTotalsRow={true} totals={props.totals} />
    </ul>
  );
}