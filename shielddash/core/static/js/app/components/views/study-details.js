import React from 'react';
import StudyChannel from './study-channel';
import StudyTotalsRow from './study-totals-row';
import FetchError from './fetch-error';
import Loading from './loading';
import PercentToggleContainer from '../containers/percent-toggle-container';


export default function(props) {
  if (props.status !== 200) {
    return (<FetchError status={props.status} />);
  }

  let classes = ['study-wrapper'];

  if (props.isFetching) {
    classes.push('fetching');
  }
  if (props.showPercentage) {
    classes.push('show-percentage')
  }

  return (
    <div className={classes.join(' ')}>
      <header>
        <h2 className="study-title">{props.study.study}</h2>
        <PercentToggleContainer />
      </header>
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
