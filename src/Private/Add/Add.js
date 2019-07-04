import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import AddJob from './AddJob';
import AddContact from './AddContact';

class Add extends Component {
  render() {
    return (
      <Switch>
        <Route path="/Add/Contact" component={AddContact} />
        <Route path="/Add/Job" component={AddJob} />
      </Switch>
    )
  }
}

export default Add;
