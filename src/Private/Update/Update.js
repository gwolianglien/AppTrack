import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import UpdateJob from './UpdateJob';
import UpdateContact from './UpdateContact';

class Update extends Component {
  render() {
    return (
      <Switch>
        <Route path="/Update/Contact" component={UpdateContact} />
        <Route path="/Update/Job" component={UpdateJob} />
      </Switch>
    )
  }
}

export default Update;
