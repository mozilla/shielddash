import React from 'react';
import MainHeading from '../views/main-heading';


export default React.createClass({
  isLinked: function() {
    // Get the current route name (sad it has to be this way)
    let currentRouteName = this.props.myRoutes[this.props.myRoutes.length - 1].name;

    return currentRouteName !== 'home';
  },
  render: function() {
    return (<MainHeading isLinked={this.isLinked()} />);
  }
});