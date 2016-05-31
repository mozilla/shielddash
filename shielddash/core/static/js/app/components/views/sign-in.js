import React from 'react';
import LoginButtonContainer from '../containers/login-button-container';


export default function(props) {
  return (
    <article className="sign-in-content">
      <h1>Please <LoginButtonContainer /> to continue.</h1>
    </article>
  );
}