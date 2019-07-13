import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Header';
import Home from './Home';

class Public extends Component {

  Router() {
    return (
      <Switch>
        <Route path="/" component={Home} />
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

export default Public;
