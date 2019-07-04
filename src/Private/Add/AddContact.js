import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import firebase from '../../Fire';
import { FormInputAttribute, FormTextAreaAttribute } from '../MyComponents';
import { checkString } from '../MyFunctions';

class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticated: null,
      user: null,
      userCompanyRef: null,
      userContactRef: null,

      // Contact Values
      contactName: '',
      contactCompany: '',
      contactTitle: '',
      contactRelation: '',
      contactPhone: '',
      contactEmail: '',
      contactURL: '',
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
        let companyRef = firebase.database().ref('companies').child(user.uid);
        let contactRef = firebase.database().ref('contacts').child(user.uid);
        this.setState({
          loading: false,
          authenticated: true,
          user: user,
          userCompanyRef: companyRef,
          userContactRef: contactRef,
        });
      } else {
        this.setState({
          loading: false,
          authenticated: false,
        });
      }
    });
  }

  // CRUD functions
  add = () => {
    let newContact = {
      name: this.state.contactName,
      company: this.state.contactCompany,
      title: this.state.contactTitle,
      relation: this.state.contactRelation,
      email: this.state.contactEmail,
      phone: this.state.contactPhone,
      url: this.state.contactURL,
      notes: this.state.contactNotes,
    }

    var passedNameTest = true;
    var passedCompanyTest = true;

    if (!checkString(newContact.name)) {
      alert("Contact name cannot be blank!");
      passedNameTest = false;
    }
    if (!checkString(newContact.company)) {
      alert("Company cannot be blank!");
      passedCompanyTest = false;
    }
    if (passedNameTest && passedCompanyTest) {
      this.state.userContactRef.push(newContact);
      this.routeContacts();
    }
  }

  handleChange = (event) => {
    const newChange = event.target.value;
    this.setState({
      [event.target.name]: newChange,
    });
  }
  handleSubmit = (event) => {
    console.log(`${this.state.contactName} was added as a contact!`);
    event.preventDefault();
  }

  // Routing functions
  routeContacts = () => {
    this.props.history.push('/Contacts');
  }


  FullForm = () => {
    return (
      <form onSubmit={this.handleSubmit}>

        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="contactName" type="text" title="*Name" placeholder="Who do you know?" stateVal={this.state.contactName} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormInputAttribute idName="contactCompany" type="text" title="*Company" placeholder="Where do they work?" stateVal={this.state.contactCompany} handleChange={this.handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="contactTitle" type="text" title="Title" placeholder="What do they do?" stateVal={this.state.contactTitle} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormInputAttribute idName="contactRelation" type="text" title="Relationship" placeholder="How do you know this person?" stateVal={this.state.contactRelation} handleChange={this.handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="contactPhone" type="text" title="Phone" placeholder="Do you have their number?" stateVal={this.state.contactPhone} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormInputAttribute idName="contactEmail" type="text" title="Email" placeholder="Do you have their email?" stateVal={this.state.contactEmail} handleChange={this.handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <FormInputAttribute idName="contactURL" type="text" title="Links" placeholder="Do you have their LinkedIn or website?" stateVal={this.state.contactURL} handleChange={this.handleChange} />
          </div>
          <div className="col-lg-6">
            <FormTextAreaAttribute idName="contactNotes" title="Notes" placeholder="Any notes for this person?" stateVal={this.state.contactNotes} handleChange={this.handleChange} />
          </div>
        </div>

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

  // Render screen
  render() {
    return (
      <div className="App-layer">
        <div className="App-banner align-all-center">
          <h1>Add Your Connection!</h1>
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

export default withRouter(AddContact);
