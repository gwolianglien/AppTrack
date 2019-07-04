import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Header';
import Home from './Home';
import Companies from './Companies';
import Contacts from './Contacts';
import Jobs from './Jobs';
import Add from './Add/Add';
import Update from './Update/Update'
import Archive from './Archive';
import Help from './Help';

class Private extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: true,
    }
  }

  Router() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/Companies" component={Companies} />
        <Route path="/Contacts" component={Contacts} />
        <Route path="/Jobs" component={Jobs} />
        <Route path="/Add" component={Add} />
        <Route path="/Update" component={Update} />
        <Route path="/Archive" component={Archive} />
        <Route path="/Help" component={Help} />
      </Switch>
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        {this.Router()}
      </div>
    )
  }
}

export default Private;
