import React from 'react';

export default function(props) {
  return (
    <dl className="component-error-message">
      <dt>{props.status}</dt>
      <dd>There was a problem retrieving data from the server. You may
      want to try signing out then signing in again.</dd>
    </dl>
  );
}
