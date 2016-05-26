import React from 'react';
import {Link} from 'react-router';


export default function(props) {
  if (props.isLinked) {
    return (
      <h1>
        <Link className="primary-header-link" to="/">SHIELD Dashboard</Link>
      </h1>
    );
  }
  return (<h1>SHIELD Dashboard</h1>);
}
