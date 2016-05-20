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
            return (
              <span className={isFieldFaded(field) ? 'study-field-faded' : ''}>
                {props.totals.all[field]}
              </span>
            );
          })}
        </li>
      </ul>
    </article>
  );
}