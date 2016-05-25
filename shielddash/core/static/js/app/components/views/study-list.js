import React from 'react';
import {Link} from 'react-router';
import FetchError from './fetch-error';
import Loading from './loading';


export default function(props) {
  if (props.status !== 200) {
    return (<FetchError status={props.status} />);
  }
  return (
    <ul className={props.isFetching ? 'studies-list fetching' : 'studies-list'}>
      {props.studies.map(study => {
        return (
          <li key={study.id} className="study-list-item">
            <h2 className="study-list-heading"><Link to={'/studies/' + study.id}>{study.name}</Link></h2>
            <p>{study.description}</p>
          </li>
        );
      })}
      <Loading />
    </ul>
  );
}
