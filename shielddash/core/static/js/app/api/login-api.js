import store from '../store';
import {getLoginSuccess, getLogoutSuccess} from '../actions/login-actions';
import {browserHistory} from 'react-router';


export function performSignIn() {
  var user = {};

  window.auth2.signIn().then(function() {
    user.name = auth2.currentUser.get().getBasicProfile().getName();
    user.email = auth2.currentUser.get().getBasicProfile().getEmail();
    user.token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
    localStorage.setItem('user_name', user.name);
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('user_token', user.token);

    store.dispatch(getLoginSuccess(user));
    console.log('user signed in:', user.name);
    browserHistory.push('/');
    // Refresh the dashboard with new auth credentials.
    // There might be a better way to do this.
    window.location.reload();
  });
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
