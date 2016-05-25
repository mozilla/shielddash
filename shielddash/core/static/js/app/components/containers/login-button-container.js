import React from 'react';
import LoginButton from '../views/login-button';
import store from '../../store';
import {connect} from 'react-redux';
import * as loginApi from '../../api/login-api';


const LoginContainer = React.createClass({
  _doSignIn: function() {
    loginApi.performSignIn();
  },
  _doSignOut: function() {
    loginApi.performSignOut();
  },
  _isSignedIn: function() {
    return !!localStorage.getItem('user_token');
  },
  componentDidMount: function() {
    gapi.load('auth2', function() {
      var clientElm = document.querySelector('meta[name=google-signin-client_id]');
      if (!clientElm) {
        console.error('No google auth client ID metadata found in root HTML document.');
        return;
      }

      // Yep - that's a global auth singleton.
      window.auth2 = gapi.auth2.init({
        client_id: clientElm.getAttribute('content')
      });
    });
  },
  render: function() {
    return(
      <LoginButton signedIn={this._isSignedIn()} email={localStorage.getItem('user_email')}
                   signIn={this._doSignIn} signOut={this._doSignOut} />
    );
  }
});

const mapStateToProps = function(store) {
  return {
    user: store.loginState.user
  }
}

export default connect(mapStateToProps)(LoginContainer);
