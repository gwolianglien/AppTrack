import React, { Component } from 'react';
import firebase from './Fire';

import Loading from './Loading';
import Private from './Private/Private';
import Public from './Public/Public';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      loading: true,
    }
  }

  componentDidMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    });
  }

  checkConnection() {
    var connectionDetected = true;
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        console.log("Connection Stable");
      } else {
        console.log("No Connection Detected or Connection Unstable");
        connectionDetected = false;
      }
    });
    return connectionDetected;
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    else {
      return this.state.authenticated ? <Private /> : <Public />;
    }
  }
}

export default App;
