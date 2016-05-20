import React from 'react';
import LoginButtonContainer from '../containers/login-button-container';
import {Link} from 'react-router';
import HeadingContainer from '../containers/heading-container';


export default function(props) {
  return (
    <div className="global-wrapper">
      <header className="primary-header">
        <HeadingContainer myRoutes={props.routes} />
        <aside>
          <LoginButtonContainer />
        </aside>
      </header>
      <main>{props.children}</main>
    </div>
  );
}