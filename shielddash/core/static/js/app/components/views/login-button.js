import React from 'react';


export default function(props) {
  if (props.signedIn) {
    return (
      <div className="signed-in-wrapper">
        <h3>{props.email}</h3>
        <div className="button button-sign-out" onClick={props.signOut}>Sign Out</div>
      </div>
    );
  }
  return (
    <div className="button button-sign-in" onClick={props.signIn}>Sign In</div>
  );
}