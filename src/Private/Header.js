import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import firebase, { GoogleAuth } from '../Fire';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      loading: true,
      user: null,
    }
  }

  componentDidMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.redirectApp();
        this.setState({
          authenticated: false,
          loading: false
        })
      } else {
        this.setState({
          authenticated: true,
          loading: false,
        })
      }
    })
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
      this.redirectApp();
    }).catch((error) => {
      console.log(error.code);
      console.log(error.message);
    }).then(() => this.redirectApp());
  }

  redirectApp = () => {
    this.props.history.push('../App');
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
              <Link to="/" className="nav-link">Home</Link>
            </li>

            <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-label="Toggle navigation">
              <Link to="/Jobs" className="nav-link">Jobs</Link>
            </li>

            {/*
            <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-label="Toggle navigation">
              <Link to="/Contacts" className="nav-link">Contacts</Link>
            </li>
            */}

            <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <Link to="/" className="nav-link" onClick={this.logout}>Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(Header);
