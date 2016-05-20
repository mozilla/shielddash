import React from 'react';
import {studyFields, isFieldFaded} from '../../constants';


export default function(props) {
  return (
    <div className="study-results-row study-titles">
      <h4 />
      {studyFields.map(field => {
        return (
          <h4 className={isFieldFaded(field) ? 'study-field-faded' : ''}>{field}</h4>
        );
      })}
    </div>
  );
}