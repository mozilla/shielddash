import React from 'react';
import StudyChannel from './study-channel';
import StudyTotalsRow from './study-totals-row';


export default function(props) {
  return (
    <div className="study-wrapper">
      <h2 className="study-title">{props.study}</h2>
      {Object.keys(props.channels).map(channelName => {
        return (
          <StudyChannel channelName={channelName} channel={props.channels[channelName]} totals={props.totals[channelName]} />
        );
      })}
      <StudyTotalsRow totals={props.totals} />
    </div>
  );
}