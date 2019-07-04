import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import firebase from '../../Fire';
import { FormInputAttribute, FormTextAreaAttribute } from '../MyComponents';
import { checkString, checkAppDate, getTodayDate } from '../MyFunctions';

class AddJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      authenticated: null,
      jobName: '',
      jobCompany: '',
      jobURL: '',
      jobNotes: '',
      jobAppDate: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.add = this.add.bind(this);
  }

  // Firebase Cloud functions
  componentWillMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user,
          loading: false,
          authenticated: true,
        });
      } else {
        this.setState({
          user: null,
          loading: false,
          authenticated: false,
        });
        this.routeHome();
      }
    });
  }

  // CRUD functions
  add = () => {

    let todayDate = getTodayDate();

    let newJob = {
      name: this.state.jobName,
      company: this.state.jobCompany,
      dateApplied: this.state.jobAppDate,
      url: this.state.jobURL,
      notes: this.state.jobNotes,
      dateCreated: todayDate,
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
      let userRef = firebase.database().ref('jobs').child(this.state.user.uid);
      userRef.push(newJob);
      this.routeJobs();
    }
  }

  // Handle Change Functions
  handleChange = (event) => {
    const newChange = event.target.value;
    this.setState({
      [event.target.name]: newChange,
    });
  }
  handleSubmit = (event) => {
    console.log(`New Job was added!`);
    event.preventDefault();
  }

  // Routing functions
  routeJobs = () => {
    this.props.history.push('/Jobs');
  }

  // Form Display
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
            <FormInputAttribute idName="jobAppDate" type="date" title="Application Date" placeholder="When did you apply?" stateVal={this.state.jobAppDate} handleChange={this.handleChange} />
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

  // Render screen
  render() {
    return (
      <div className="App-body">
        <div className="App-banner align-center-all">
          <h1>Add Your Next Job!</h1>
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

export default withRouter(AddJob);
