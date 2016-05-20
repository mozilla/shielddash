import store from '../store';
import {getLoginSuccess, getLogoutSuccess} from '../actions/login-actions';
import {browserHistory} from  'react-router';


export function performSignIn() {
  var user = {};

  // Already signed in?
  if (localStorage.token) {
    user.name = localStorage.name;
    user.token = localStorage.token;
    store.dispatch(getLoginSuccess(user));
    console.log('...already signed in');
  } else { // Not signed in. Do the Google OAuth dance.
    window.auth2.signIn().then(function() {
      user.name = auth2.currentUser.get().getBasicProfile().getName();
      user.email = auth2.currentUser.get().getBasicProfile().getEmail();
      user.token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
      localStorage.setItem('user_name', user.name);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_token', user.token);

      store.dispatch(getLoginSuccess(user));
      // TODO: Nuke this log.
      console.log('user signed in:', user);
      browserHistory.push('/');
    });
  }
}

export function performSignOut() {
  gapi.auth2.getAuthInstance().signOut().then(function() {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_token');

    store.dispatch(getLogoutSuccess());
    console.log('sign out finished...');
    browserHistory.push('/signin');
  });
}