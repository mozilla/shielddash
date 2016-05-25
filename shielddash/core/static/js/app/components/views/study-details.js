import React from 'react';
import StudyChannel from './study-channel';
import StudyTotalsRow from './study-totals-row';
import FetchError from './fetch-error';
import Loading from './loading';


export default function(props) {
  if (props.status !== 200) {
    return (<FetchError status={props.status} />);
  }
  return (
    <div className={props.isFetching ? 'study-wrapper fetching' : 'study-wrapper'}>
      <h2 className="study-title">{props.study.study}</h2>
      {Object.keys(props.study.channels).map(channelName => {
        return (
          <StudyChannel channelName={channelName} channel={props.study.channels[channelName]} totals={props.totals[channelName]} />
        );
      })}
      <StudyTotalsRow totals={props.totals} />
      <Loading />
    </div>
  );
}
