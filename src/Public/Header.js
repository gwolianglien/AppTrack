import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase, { GoogleAuth } from '../Fire';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      user: null,
    }
  }

  componentDidMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        let userRef = firebase.database().ref('users');
        var userEmail = user.email;
        userRef.child(user.uid).set({
          email: userEmail
        }).then(() =>
          this.setState({
            authenticated: true,
            user: user,
          })
        );
      } else {
        this.setState({
          authenticated: false,
          user: null,
        });
      }
    });
  }

  login = () => {
    firebase.auth().signInWithPopup(GoogleAuth).then((result) => {
      console.log("Sign in successful");
      this.setState({
        authenticated: true,
      });
    }).catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
  }

  logout = () => {
    firebase.auth().signOut().then((result) => {
      console.log("Sign Out successful");
      this.setState({
        authenticated: false,
      });
    }).catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-light">
        <Link to="/" className="navbar-brand">AppTrack</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar mr-auto"></ul>
          <ul className="navbar-nav">
            <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <Link to="/" className="nav-link" onClick={this.login}>Login</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
