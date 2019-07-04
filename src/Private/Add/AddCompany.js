import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import firebase from '../../Fire';
import { FormInputAttribute, FormTextAreaAttribute } from '../MyComponents';
import { checkString, checkExists } from '../MyFunctions';

class AddCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticated: null,
      userCompanyRef: null,
      userContactRef: null,
      userRoleRef: null,
      userCompanies: [],

      // Company details
      companyName: '',
      companyNotes: '',

      // Job details
      jobName: '',
      jobCompany: '', // Implicit; add this to match companyName
      jobURL: '',
      jobNotes: '',
      appDeadline: '',

      // Contact details
      contactName: '',
      contactPhone: '',
      contactRelation: '',
      contactCompany: '', // Implicit; add this to match companyName
      contactEmail: '',
      contactURL: '',
      contactTitle: '',
      contactNotes: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.add = this.add.bind(this);
  }

  // Firebase Cloud functions
  componentWillMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let companyRef = firebase.database().ref('companies').child(`${user.uid}`);
        let contactRef = firebase.database().ref('contacts').child(`${user.uid}`);
        let roleRef = firebase.database().ref('jobs').child(`${user.uid}`);

        let companiesList = []
        companyRef.once('value', (data) => {
          let allCompanies = data.val();
          for (let company in allCompanies) {
            var thisCompany = {
              name: allCompanies[company].name,
              notes: allCompanies[company].notes,
            }
            companiesList.push(thisCompany);
          }
        }).then(() => this.setState({
          loading: false,
          authenticated: true,
          userCompanyRef: companyRef,
          userContactRef: contactRef,
          userRoleRef: roleRef,
          userCompanies: companiesList,
        }));
      } else {
        this.setState({
          loading: false,
          authenticated: false,
        });
        this.routeCompanies();
      }
    });
  }

  // CRUD functions
  add = () => {
    let newCompany = {
      name: this.state.companyName,
      notes: this.state.companyNotes,
    }

    let newJob = {
      name: this.state.jobName,
      company: this.state.companyName,
      url: this.state.jobURL,
      deadline: this.state.appDeadline,
      notes: this.state.jobNotes,
    }

    let newContact = {
      name: this.state.contactName,
      company: this.state.companyName,
      title: this.state.contactTitle,
      email: this.state.contactEmail,
      phone: this.state.contactPhone,
      relation: this.state.contactRelation,
      url: this.state.contactURL,
      notes: this.state.contactNotes,
    }

    var companyNamePassed = true;
    var dupeCompanyPassed = true;
    if (!checkString(newCompany.name)) {
      alert("Company name cannot be blank!");
      companyNamePassed = false;
    }
    if (checkExists(newCompany.name, this.state.userCompanies)) {
      alert("You already have this company in your list!");
      dupeCompanyPassed = false;
    }

    if (companyNamePassed && dupeCompanyPassed) {
      if (checkString(newContact.name)) {
        this.state.userContactRef.push(newContact);
      }
      if (checkString(newJob.name)) {
        this.state.userRoleRef.push(newJob);
      }
      this.state.userCompanyRef.push(newCompany).then(() => this.routeCompanies());
    }
  }

  handleChange = (event) => {
    const newChange = event.target.value;
    this.setState({
      [event.target.name]: newChange,
    });
  }
  handleSubmit = (event) => {
    console.log(`${this.state.companyName} was added!`);
    event.preventDefault();
  }

  // Routing functions
  routeCompanies = () => {
    this.props.history.push('/Companies');
  }

  CompanyForm = () => {
    return (
      <div className="row">
        <div className="col-lg-6">
          <FormInputAttribute idName="companyName" type="text" title="*Name" placeholder="What is your dream company?" stateVal={this.state.companyName} handleChange={this.handleChange} />
        </div>
        <div className="col-lg-6">
          <FormTextAreaAttribute idName="companyNotes" title="Notes" placeholder="Any notes on this company?" stateVal={this.state.companyNotes} handleChange={this.handleChange} />
        </div>
      </div>
    )
  }

  JobForm = () => {
    return (
      <div className="collapse" id="jobsForm">
        <div className="row">
          <div className="align-all-center">
            <h3>Add a Position</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="jobName" type="text" title="*Name" placeholder="What role are you applying for?" stateVal={this.state.jobName} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormInputAttribute idName="jobURL" type="text" title="Link" placeholder="Do you have a link to the job application?" stateVal={this.state.jobURL} handleChange={this.handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="appDeadline" type="date" title="App Deadline" placeholder="Is there an app deadline??" stateVal={this.state.appDeadline} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormTextAreaAttribute idName="jobNotes" title="Notes" placeholder="Any notes for this job?" stateVal={this.state.jobNotes} handleChange={this.handleChange} />
          </div>
        </div>
      </div>
    )
  }

  ContactForm = () => {
    return (
      <div className="collapse" id="contactsForm">
        <div className="row">
          <div className="align-all-center">
            <h3>Add a Contact</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="contactName" type="text" title="*Name" placeholder="Who do you know?" stateVal={this.state.contactName} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormInputAttribute idName="contactTitle" type="text" title="Title" placeholder="What do they do?" stateVal={this.state.contactTitle} handleChange={this.handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="contactRelation" type="text" title="Relationship" placeholder="How do you know this person?" stateVal={this.state.contactRelation} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormInputAttribute idName="contactPhone" type="text" title="Phone" placeholder="Do you have their number?" stateVal={this.state.contactPhone} handleChange={this.handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="contactEmail" type="text" title="Email" placeholder="Do you have their email?" stateVal={this.state.contactEmail} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormInputAttribute idName="contactURL" type="text" title="Links" placeholder="Do you have their LinkedIn or website?" stateVal={this.state.contactURL} handleChange={this.handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <FormTextAreaAttribute idName="contactNotes" title="Notes" placeholder="Any notes for this person?" stateVal={this.state.contactNotes} handleChange={this.handleChange} />
          </div>
        </div>
      </div>
    )
  }
  CollapseFormControl = () => {
    return (
      <div className="row">
        <div className="col-lg-6">
          <div className="form-group">
            <div className="container">
              <div className="btn-group d-none d-md-flex justify-content-center">
                <button className="btn btn-success" type="button" data-toggle="collapse" data-target="#jobsForm" aria-expanded="false" aria-controls="positionsForm">
                  Do you know what positions you want to apply for?
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="form-group">
            <div className="container">
              <div className="btn-group d-none d-md-flex justify-content-center">
                <button className="btn btn-success" type="button" data-toggle="collapse" data-target="#contactsForm" aria-expanded="false" aria-controls="contactsForm">
                  Do you have any contacts you know or want to reach out to?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  FullForm = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.CompanyForm()}
        {this.JobForm()}
        {this.ContactForm()}
        {this.CollapseFormControl()}
        <div className="form-group">
          <div className="container">
            <div className="btn-group d-none d-md-flex justify-content-center">
              <button className="btn btn-primary" onClick={this.add}>Add!</button>
            </div>
          </div>
        </div>
      </form>
    )
  }

  // Render form
  render() {
    return (
      <div className="App-layer">
        <div className="App-banner align-all-center">
          <h1>Add Your Target Company!</h1>
        </div>
        <div className="App-body">
          <div className="form-container">
            {this.FullForm()}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(AddCompany);
