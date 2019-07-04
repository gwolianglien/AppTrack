import React, { Component } from 'react';

class Help extends Component {
  render() {
    return (
      <div className="App-content">
        <div className="App-banner">
          <h1 className="align-center-text">Start Your Job Hunt with <strong>AppTrack</strong>.</h1>
        </div>
        <div className="App-body">
          <div className="row">
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="align-center-text">1. Find Your <strong>Jobs & Contacts</strong></h3>
                  <img className="card-img-top" src={""} alt="Favorite Companies Logo" />
                  <p className="card-text align-center-text">Keep a tab on who and what catches your eye.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="align-center-text">2. Prepare a <strong>Plan of Attack</strong></h3>
                  <img className="card-img-top" src={""} alt="Target Roles Logo" />
                  <p className="card-text align-center-text">Organization is key. Track everything you'll need.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="align-center-text">3. Launch Your <strong>Career Jump</strong></h3>
                  <img className="card-img-top" src={""} alt="Point of Contact Logo" />
                  <p className="card-text align-center-text">Rinse and repeat until your success.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Help;
