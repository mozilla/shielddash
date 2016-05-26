import React from 'react';
import {studyFields, isFieldFaded} from '../../constants';


const getPercentageField = function(field, count, percent) {
  return (
    <span className={isFieldFaded(field) ? 'study-field-faded' : ''}>
      <b className="count">{count}</b>
      <b className="percent">{percent + '%'}</b>
    </span>
  );
}

const StudyResultsRow = React.createClass({
  render: function() {
    if (this.props.isTotalsRow) {
      return (
        <li className="study-results-row study-channel-totals-row">
          <span />
          {studyFields.map(field => {
            let count = this.props.totals[field];
            let percent = Math.round(count / this.props.totals['installed'] * 1000) / 10;

            if (field.substring(0, 4) === 'seen') { // These have a % toggle.
              return getPercentageField(field, count, percent);
            }

            return (
              <span className={isFieldFaded(field) ? 'study-field-faded' : ''}>
                {count}
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
          let installed = this.props.channel[this.props.type]['installed'];
          let percent = Math.round(count / installed * 1000) / 10;

          if (field.substring(0, 4) === 'seen') { // These have a % toggle.
            return getPercentageField(field, count, percent);
          }

          return (
            <span className={isFieldFaded(field) ? 'study-field-faded' : ''}>
              {count}
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
