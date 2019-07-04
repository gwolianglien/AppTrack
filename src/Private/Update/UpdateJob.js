import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import firebase from '../../Fire';
import { FormInputAttribute, FormTextAreaAttribute } from '../MyComponents';
import { checkString, checkAppDate } from '../MyFunctions';

class UpdateJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticated: null,
      userJobsRef: null,
      id: null,
      jobName: null,
      jobCompany: null,
      jobURL: null,
      jobNotes: null,
      dateApplied: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.update = this.update.bind(this);
  }

  // Firebase Cloud functions
  componentWillMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let jobID = this.props.location.state.id;
        let jobsRef = firebase.database().ref('jobs').child(user.uid);
        jobsRef.once('value', (data) => {
          let allJobs = data.val();

          var name = allJobs[jobID].name ? allJobs[jobID].name : "";
          var company = allJobs[jobID].company ? allJobs[jobID].company : "";
          var url = allJobs[jobID].url ? allJobs[jobID].url : "";
          var dateApplied = allJobs[jobID].dateApplied ? allJobs[jobID].dateApplied : "";
          var notes = allJobs[jobID].notes ? allJobs[jobID].notes : "";

          this.setState({
            user: user,
            id: jobID,
            jobName: name,
            jobCompany: company,
            jobURL: url,
            dateApplied: dateApplied,
            jobNotes: notes,
          });

        }).then(() => this.setState({
          loading: false,
          authenticated: true,
          userJobsRef: jobsRef,
        }));
      } else {
        this.setState({
          loading: false,
          authenticated: false,
        });
        this.routeHome();
      }
    });
  }

  // CRUD functions
  update = () => {
    let newJob = {
      name: this.state.jobName,
      company: this.state.jobCompany,
      url: this.state.jobURL,
      notes: this.state.jobNotes,
      dateApplied: this.state.dateApplied,
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

    if (passedNameTest && passedCompanyNameTest && passedAppDateTest) {
      this.state.userJobsRef.child(this.state.id).set(newJob);
      this.routeJobs();
    }
  }

  /* Handle Change Functions */
  handleChange = (event) => {
    const newChange = event.target.value;
    this.setState({
      [event.target.name]: newChange,
    });
  }
  handleSubmit = (event) => {
    console.log("Job updated!");
    event.preventDefault();
  }

  // Routing functions
  routeJobs = () => {
    this.props.history.push('/Jobs');
  }

  FullForm = () => {
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
            <FormInputAttribute idName="jobURL" type="text" title="Link" placeholder="Do you have a link to the job application?" stateVal={this.state.jobURL} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormInputAttribute idName="dateApplied" type="date" title="Application Date" placeholder="When did you apply?" stateVal={this.state.dateApplied} handleChange={this.handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <FormTextAreaAttribute idName="jobNotes" title="Notes" placeholder="Any notes for this job?" stateVal={this.state.jobNotes} handleChange={this.handleChange} />
          </div>
        </div>

        <div className="form-group">
          <div className="container">
            <div className="btn-group d-none d-md-flex justify-content-center">
              <button className="btn btn-primary" onClick={this.update}>Update!</button>
            </div>
          </div>
        </div>
      </form>
    )
  }

  // Render screen
  render() {
    return (
      <div className="App-body">
        <div className="App-banner align-center-all">
          <h1>Update Your Job!</h1>
        </div>
        <div className="App-content">
          <div className="form-container">
            {this.FullForm()}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(UpdateJob);
