import React from 'react';
import StudyResultsList from './study-results-list';
import StudyTitlesRow from './study-titles-row';


export default function(props) {
  return (
    <article>
      <h3 className="release-channel-title">Firefox: {props.channelName}</h3>
      <StudyTitlesRow channel={props.channel} />
      <StudyResultsList channel={props.channel} totals={props.totals} />
    </article>
  );
}