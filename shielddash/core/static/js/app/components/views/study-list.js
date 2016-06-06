import React from 'react';
import {Link} from 'react-router';
import FetchError from './fetch-error';
import Loading from './loading';
import DateRange from './date-range';


function listStudies(studies) {
  return (
    <ul className="studies-list">
      {studies.map(study => {
        return listStudy(study);
      })}
    </ul>
  );
}

function listStudy(study) {
  return (
    <li key={study.id} className="study-list-item">
      <h3 className="study-list-heading"><Link to={'/studies/' + study.id}>{study.name}</Link></h3>
      <DateRange startTime={study.start_time} endTime={study.end_time} />
      <p>{study.description}</p>
    </li>
  );
}

export default function(props) {
  if (props.status !== 200) {
    return (<FetchError status={props.status} />);
  }

  var now = Date.now();
  var ongoingStudies = props.studies.filter(study => {
    return new Date(study.start_time) <= now && new Date(study.end_time) >= now;
  });
  var futureStudies = props.studies.filter(study => {
    return new Date(study.start_time) > now;
  });
  var completedStudies = props.studies.filter(study => {
    return new Date(study.end_time) < now;
  });

  return (
    <article className={props.isFetching ? 'fetching' : ''}>
      {ongoingStudies.length > 0 &&
        <section id="ongoing-studies">
          <h2>Ongoing studies</h2>
          {listStudies(ongoingStudies)}
        </section>
      }

      {futureStudies.length > 0 &&
        <section id="future-studies">
          <h2>Future studies</h2>
          {listStudies(futureStudies)}
        </section>
      }

      {completedStudies.length > 0 &&
        <section id="completed-studies">
          <h2>Completed studies</h2>
          {listStudies(completedStudies)}
        </section>
      }

      <Loading />
    </article>
  );
}
