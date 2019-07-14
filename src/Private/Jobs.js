import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import firebase from '../Fire';

import {
  // For Main Page Controls and Forms
  Navigator, FormInputAttribute, FormTextAreaAttribute, Banner,

  // For Job Cards
  JobCardHeader, JobCardBody, JobCardControls,
} from './MyComponents';

import {
  // Routing
  routeArchive, routeHelp, routeHome, routeJobs, routeUpdateJob,

  // Data check
  getTodayDate, getNumDaysApart,

  // Form Check
  checkString, checkAppDate,
} from './MyFunctions';

export const Demo = () => {
  return (
    <div className="container-fluid row card-columns d-flex flex-wrap">
      <div className="col-lg-6">
        <div className="card border-primary">
          <div className="card-body">
            <div className="card-header card-header-effects" data-toggle="collapse" data-target="#demo" aria-expanded="false" aria-controls="demo">
              <h5>This is Your Sample Job Tracker!</h5>
              <p>Click ME for Details!</p>
            </div>
            <div className="collapse" id="demo">
              <div className="card card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Do you have your resume?</li>
                  <li className="list-group-item">Do you have your cover letter?</li>
                  <li className="list-group-item">Save that job link here!</li>
                  <li className="list-group-item">Do you need to prepare anything else?</li>
                </ul>
              </div>
            </div>
            <div className="collapse" id="demo">
              <FormInputAttribute idName="jobAppDate" type="date" title="When did you apply?" placeholder="When did you apply?" />
              <button className="btn btn-primary" type="button">
                Did You Apply Yet?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticated: null,
      user: null,
      offers: [],
      savedJobs: [],
      recentApps: [],

    }
    this.add = this.add.bind(this);
    this.updateApplicationDate = this.updateApplicationDate.bind(this);
    this.removeJob = this.removeJob.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var userJobsRef = firebase.database().ref('jobs').child(user.uid);

        var results = []; // for jobs with offers
        var saved = []; // for general saved jobs, with no application date
        var recent = []; // for recent applications

        userJobsRef.once('value', (data) => {
          let allJobs = data.val();
          for (let job in allJobs) {
            let curr = {
              id: job,
              name: allJobs[job].name,
              company: allJobs[job].company,
              dateApplied: allJobs[job].dateApplied,
              dateCreated: allJobs[job].dateCreated,
              url: allJobs[job].url,
              offer: allJobs[job].offer,
              notes: allJobs[job].notes,
            }

            var numDaysSinceApp = curr.dateApplied ? getNumDaysApart(curr.dateApplied, getTodayDate()) : -1;

            if (curr.dateApplied) {
              if (curr.offer === "1") {
                results.push(curr);
              } else if (curr.offer === "0") {
                continue;
              } else {
                if (numDaysSinceApp <= 21 && numDaysSinceApp >= 0) {
                  recent.push(curr);
                }
              }
            } else {
              saved.push(curr);
            }
          }
        }).then(() => this.setState({
            loading: false,
            authenticated: true,
            user: user,
            offers: results,
            savedJobs: saved,
            recentApps: recent,
          })
        );
      } else {
        this.setState({
          loading: false,
          authenticated: false,
        });
        routeHome(this.props.history);
      }
    });
  }

  componentDidUpdate(nextProps) {
    if (nextProps.offer !== this.props.offer) {
      this.setState({ offer: nextProps.offer});
    }
    if (nextProps.dateApplied !== this.props.dateApplied) {
      this.setState({ dateApplied: nextProps.dateApplied});
    }
  }

  // CRUD functions
  add = () => {

    let todayDate = getTodayDate();

    var thisJobAppDate = this.state.jobAppDate ? this.state.jobAppDate : "";
    var thisJobUrl = this.state.jobURL ? this.state.jobURL : "";
    var thisJobNotes = this.state.jobNotes ? this.state.jobNotes : "";

    let newJob = {
      name: this.state.jobName,
      company: this.state.jobCompany,
      dateApplied: thisJobAppDate,
      dateCreated: todayDate,
      offer: "",
      url: thisJobUrl,
      notes: thisJobNotes,
    }

    var passedNameTest = checkString(newJob.name) ? true : false;
    var passedCompanyNameTest = checkString(newJob.company) ? true : false;
    var passedAppDateTest = checkAppDate(newJob.dateApplied) ? true : false;

    if (!passedNameTest) {
      alert("Job name cannot be blank!");
    }
    else if (!passedCompanyNameTest) {
      alert("Company name cannot be blank!");
    }
    else if (!passedAppDateTest) {
      alert("Application date can't be in the future!");
    }

    // Add only if all tests pass and return true
    if (passedNameTest && passedCompanyNameTest && passedAppDateTest) {
      firebase.database().ref('jobs').child(this.state.user.uid).push(newJob);
      this.refreshWindow();
    }
  }

  updateApplicationDate = (jobId) => {

    var newJobAppDate = this.state.jobAppDate;
    if (!newJobAppDate) {
      // If user did not input any dates, refresh window
      this.refreshWindow();
      console.log("Error in updating Application Date")
      routeJobs(this.props.history);
    }

    var passedAppDateTest = checkAppDate(newJobAppDate) ? true : false;
    if (!passedAppDateTest) {
      alert("Application date can't be in the future!");
      this.refreshWindow();
    }

    var temp = { 'dateApplied': newJobAppDate }
    var path = firebase.database().ref('jobs').child(this.state.user.uid).child(jobId);
    path.update(temp);
    this.refreshWindow();
  }

  updateApplicationResult = (jobId) => {

    var offer = this.state.offer;
    if (offer === "" || typeof(offer) === "undefined") {
      this.refreshWindow();
      routeJobs(this.props.history);
    }

    var temp = { 'offer': offer }
    var path = firebase.database().ref('jobs').child(this.state.user.uid).child(jobId);
    path.update(temp);
    this.refreshWindow();
  }

  removeJob = (jobID) => {
    let userJobDBRef = firebase.database().ref('jobs').child(this.state.user.uid).child(jobID);
    userJobDBRef.remove().then(() => this.refreshWindow());
  }

  // State and Screen Change Functions
  handleChange = (event) => {
    const newValue = event.target.value;
    this.setState({
      [event.target.name]: newValue,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  refreshWindow = () => {
    window.location.reload();
  }

  /* Add Job Form */
  JobAddForm = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="jobName" type="text" title="*Title" placeholder="What role are you applying for?" stateVal={this.state.jobName} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormInputAttribute idName="jobCompany" type="text" title="*Company" placeholder="Which company are you applying to?" stateVal={this.state.jobCompany} handleChange={this.handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="jobAppDate" type="date" title="Did You Apply Yet?" placeholder="When did you apply?" stateVal={this.state.jobAppDate} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormInputAttribute idName="jobURL" type="text" title="Link" placeholder="Do you have a link to the job application?" stateVal={this.state.jobURL} handleChange={this.handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <FormTextAreaAttribute idName="jobNotes" title="Notes" placeholder="Are there any special things to be aware of for this job?" stateVal={this.state.jobNotes} handleChange={this.handleChange} />
          </div>
        </div>
        <div className="form-group">
          <div className="container">
            <div className="btn-group d-none d-md-flex justify-content-center">
              <button className="btn btn-primary" onClick={this.add}>Add This Job!</button>
            </div>
          </div>
        </div>
      </form>
    )
  }

  /* Offers Container */
  Offers = () => {
    if (this.state.offers.length > 0) {
      return (
        <div className="App-section">
          <h3 className="align-center-all">Congratulations on your offers!</h3>
          <div className="container-fluid row card-columns d-flex flex-wrap">
            {this.state.offers.map((job, i) => {

              var bodyId = `offer-details-${i}`;
              // Card
              return (
                <div key={i} className="col-lg-4">
                  <div className="card border-success">
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
        </div>
      )
    }
  }

  /* Applied Jobs Container */
  RecentApps = () => {
    if (this.state.recentApps.length > 0) {
      return (
        <div className="App-section">
          <h3 className="align-center-all">Your Recent Apps</h3>
          <div className="container-fluid row card-columns d-flex flex-wrap">
            {this.state.recentApps.map((job, i) => {
              var bodyId = `recent-app-details-${i}`;
              var updateId = `recent-app-results-${i}`;
              // Card
              return (
                <div key={i} className="col-lg-4">
                  <div className="card border-primary">
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
        </div>
      )
    }
  }

  /* Saved Jobs Container */
  SavedJobs = () => {
    if (this.state.savedJobs.length > 0) {
      return (
        <div className="App-section">
          <h3 className="align-center-all">Your Saved Jobs</h3>
          <div className="container-fluid row card-columns d-flex flex-wrap">
            {this.state.savedJobs.map((job, i) => {
              var bodyId = `saved-job-details-${i}`;
              var appId = `saved-job-update-${i}`;
              // Card
              return (
                <div key={i} className="col-lg-4">
                  <div className="card border-info">
                    <div className="card-body">
                      <JobCardHeader
                        job={job}
                        CardBodyId={bodyId}
                      />
                      <JobCardBody
                        type="Saved"
                        job={job}
                        CardBodyId={bodyId}

                        ShowRemoveButton={true}
                        Remove={() => this.removeJob(job.id)}

                        ShowAppId={appId}
                        StateValue={this.state.offer}
                        HandleChange={this.handleChange}
                        HandleSubmit={this.handleSubmit}
                        UpdateDetails={() => routeUpdateJob(this.props.history, job.id)}
                        UpdateApp={() => this.updateApplicationDate(job.id)}
                      />
                      <JobCardControls
                        ShowAppliedButton={true}
                        ShowAppId={appId}
                      />
                    </div>
                  </div>
                </div>
              )
              //

            })}
          </div>
        </div>
      )
    }
  }

  Container = () => {
    if (this.state.offers.length > 0 || this.state.recentApps.length > 0 || this.state.savedJobs.length > 0) {
      return (
        <span>
          {this.Offers()}
          {this.RecentApps()}
          {this.SavedJobs()}
        </span>
      )
    } else {
      return <Demo />;
    }
  }

  render() {
    return (
      <div className="App-body">
        <Banner
          Text={"Pursue What Excites You."} />

        <div className="container-body container-body-shift">

          {/* Page Controls and Navigation */}
          <div className="App-controls">
            <Navigator
              add="Start a Job App!"
              archive="See Past Apps"
              routeHelp={() => routeHelp(this.props.history)}
              routeArchive={() => routeArchive(this.props.history)}
            />
          </div>

          {/* Job Add Form */}
          <div className="collapse" id="add-form">
            {this.JobAddForm()}
          </div>

          {/* User Content */}
          {this.Container()}
        </div>
      </div>
    )
  }
}

export default withRouter(Jobs);
