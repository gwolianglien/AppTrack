import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import firebase from '../Fire';

import {
  // For Job Cards
  JobCardHeader, JobCardBody, JobCardControls,
} from './MyComponents';

import {
  // Data check
  getTodayDate, getNumDaysApart,
} from './MyFunctions';

class Archive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      authenticated: null,
      archived: [],
      rejections: [],
    }
  }

  componentDidMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var archivedJobs = [];
        var rejectedJobs = [];
        var dbRef = firebase.database().ref('jobs').child(user.uid);

        dbRef.once('value', (data) => {
          let allJobs = data.val();
          for (let job in allJobs) {

            var currName = allJobs[job].name ? allJobs[job].name : "";
            var currCompany = allJobs[job].company ? allJobs[job].company : "";
            var currDateApplied = allJobs[job].dateApplied ? allJobs[job].dateApplied : "";
            var currDateCreated = allJobs[job].dateCreated ? allJobs[job].dateCreated : "";
            var currOffer = allJobs[job].offer ? allJobs[job].offer : "";
            var currUrl = allJobs[job].url ? allJobs[job].url : "";
            var currNotes = allJobs[job].notes ? allJobs[job].notes : "";

            let thisJob = {
              id: job,
              name: currName,
              company: currCompany,
              dateApplied: currDateApplied,
              dateCreated: currDateCreated,
              offer: currOffer,
              url: currUrl,
              notes: currNotes,
            }

            console.log(thisJob);
            var numDaysSinceApp = thisJob.dateApplied ? getNumDaysApart(thisJob.dateApplied, getTodayDate()) : -1;
            console.log(numDaysSinceApp);

            if (thisJob.offer === "1") {
              continue;  // Offers section on Jobs page
            }
            if (numDaysSinceApp < 0) {
              continue;  // Saved section on Jobs page
            }

            if (!thisJob.dateApplied) {
              continue;
            } else {
              if (thisJob.offer === "0") {
                rejectedJobs.push(thisJob);
              } else {
                if (numDaysSinceApp > 21) {
                  archivedJobs.push(thisJob);
                }
              }
            }

          }
        }).then(() => this.setState({
          user: user,
          authenticated: true,
          archived: archivedJobs,
          rejections: rejectedJobs,
        }));
      }
      // Cannot detect user //
      else {
        this.setState({
          authenticated: false,
        })
      }
    })
  }

  updateApplicationResult = (jobId) => {
    var res = this.state.offer;
    var path = firebase.database().ref('jobs').child(this.state.user.uid).child(jobId);
    var temp = {}
    temp['offer'] = res;
    path.update(temp);
    this.refreshWindow();
  }

  removeJob = (jobID) => {
    let userJobDBRef = firebase.database().ref('jobs').child(this.state.user.uid).child(jobID);
    userJobDBRef.remove().then(() => this.refreshWindow());
  }

  /* State and Screen Change Functions */
  handleChange = (event) => {
    const newChange = event.target.value;
    this.setState({
      [event.target.name]: newChange,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  refreshWindow = () => {
    window.location.reload();
  }

  /* Container */
  Rejections = () => {

    if (!this.state.rejections) {
      return null;
    }

    return (
      <div className="container-fluid row card-columns d-flex flex-wrap">
        {this.state.rejections.map((job, i) => {
          var bodyId = `rejection-details-${i}`;
          // Card
          return (
            <div key={i} className="col-lg-4">
              <div className="card border-danger">
                <div className="card-body">
                  <JobCardHeader
                    job={job}
                    CardBodyId={bodyId}
                  />
                  <JobCardBody
                    type="Offer"
                    job={job}
                    CardBodyId={bodyId}
                    ShowRemoveButton={true}
                    Remove={() => this.removeJob(job.id)}
                  />
                </div>
              </div>
            </div>
          )
          //
        })}
      </div>
    )
  }

  ArchivedJobs = () => {

    if (!this.state.archived && !this.state.rejections) {
      return (
        <p>You don't have any previous applications!</p>
      )
    }

    return (
      <div className="container-fluid row card-columns d-flex flex-wrap">
        {this.state.archived.map((job, i) => {
          var bodyId = `recent-app-details-${i}`;
          var updateId = `recent-app-results-${i}`;

          /* Cards */
          return (
            <div key={i} className="col-lg-4">
              <div className="card border-warning">
                <div className="card-body">
                  <JobCardHeader
                    job={job}
                    CardBodyId={bodyId}
                  />
                  <JobCardBody
                    type="RecentApp"
                    job={job}
                    CardBodyId={bodyId}

                    ShowRemoveButton={true}
                    Remove={() => this.removeJob(job.id)}

                    ShowResultsId={updateId}
                    StateValue={this.state.offer}
                    HandleChange={this.handleChange}
                    HandleSubmit={this.handleSubmit}
                    Update={() => this.updateApplicationResult(job.id)}
                  />
                  <JobCardControls
                    ShowResultsButton={true}
                    ShowResultsId={updateId}
                  />
                </div>
              </div>
            </div>
          )
          //
        })}
      </div>
    )
  }

  render() {
    return (
      <div className="App-body">
        <div className="App-banner align-center-all">
          <h1>Your Past Apps</h1>
        </div>
        <div className="App-content">
          {this.Rejections()}
          {this.ArchivedJobs()}
        </div>
      </div>
    )
  }
}

export default Archive;
