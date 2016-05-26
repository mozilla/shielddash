import React from 'react';
import {studyFields, isFieldFaded} from '../../constants';


export default function(props) {
  return (
    <article>
      <h3 className="release-channel-title">All</h3>
      <ul>
        <li className="study-results-row study-totals-row">
          <span />
          {studyFields.map(field => {
            let count = props.totals.all[field];
            let percent = Math.round(count / props.totals.all['installed'] * 1000) / 10;

            if (field.substring(0, 4) === 'seen') { // These have a % toggle.
              return (
                <span className={isFieldFaded(field) ? 'study-field-faded' : ''}>
                  <b className="count">{count}</b>
                  <b className="percent">{percent + '%'}</b>
                </span>
              );
            }

            return (
              <span className={isFieldFaded(field) ? 'study-field-faded' : ''}>
                {count}
              </span>
            );
          })}
        </li>
      </ul>
    </article>
  );
}
