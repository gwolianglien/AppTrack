import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebase from '../Fire';

import {
  getTodayDate, getNumDaysApart,
} from './MyFunctions';

const JobScoreCard = (props) => {
  return (
    <div className="col-lg-4">
      <div className="card border-dark">
        <div className="card-body">
          <Link className="card-link" to={props.Link}>
            <div className="card-header card-header-effects">
              <h5 className="card-title align-center-all">Your Job Score</h5>
            </div>
          </Link>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">You applied to: <strong>{props.AppScore}</strong> role(s) this week</li>
            <li className="list-group-item">You've gotten: <strong>{props.OfferScore}</strong> offer(s)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const CompaniesScoreCard = (props) => {
  return (
    <div className="col-lg-4">
      <div className="card border-dark">
        <div className="card-body">
          <Link className="card-link" to={props.Link}>
            <div className="card-header card-header-effects">
              <h5 className="card-title align-center-all">Your Companies Score</h5>
            </div>
          </Link>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">You added: <strong>{props.CompanyScore}</strong> new firm(s) this week</li>
            <li className="list-group-item">You've added a total of: <strong>{props.TotalCompanyScore}</strong> firm(s)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const ContactScoreCard = (props) => {
  return (
    <div className="col-lg-4">
      <div className="card border-dark">
        <div className="card-body">
          <Link className="card-link" to={props.Link}>
            <div className="card-header card-header-effects">
              <h5 className="card-title align-center-all">Your Contacts Score</h5>
            </div>
          </Link>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">You added: <strong>{props.ContactScore}</strong> new contact(s) this week</li>
            <li className="list-group-item">You've reached out to: <strong>{props.OutreachScore}</strong> people</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      loading: true,
      user: null,
      companies: [],
      jobs: [],
      userContacts: [],
    }
  }

  componentDidMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.mountUserData(user);
        this.setState({
          user: user,
          authenticated: true,
          loading: false,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    })
  }

  // Database Read Functions
  mountUserData = (user) => {
    this.mountCompanies(user);
    // this.mountUserContacts(user);
    this.mountJobs(user);
  }

  mountCompanies = (user) => {
    var companyScore = 0;
    var totalCompanyScore = 0;
    var today = getTodayDate();
    let list = []
    let companiesRef = firebase.database().ref('companies').child(user.uid);
    companiesRef.once('value', (data) => {
      let allCompaniesData = data.val();
      for (var company in allCompaniesData) {
        var currCompany = {
          id: company,
          name: allCompaniesData[company].name,
          notes: allCompaniesData[company].notes,
          dateAdd: allCompaniesData[company].dateAdd,
        }
        list.push(currCompany);

        var n = getNumDaysApart(currCompany.dateAdd, today);
        if (n <= 7) {
          companyScore++;
        }
      }
      totalCompanyScore = list.length;
    }).then(() => {
      this.setState({
        companies: list,
        CompanyScore: companyScore,
        TotalCompanyScore: totalCompanyScore,
      });
    });
  }

  mountUserContacts = (user) => {
    let contactsRef = firebase.database().ref('contacts').child(user.uid);
    let contacts = []
    contactsRef.once('value', (data) => {
      let allUserContacts = data.val();
      for (var contact in allUserContacts) {
        var thisContact = {
          id: contact,
          name: allUserContacts[contact].name,
          company: allUserContacts[contact].company,
          title: allUserContacts[contact].title,
          email: allUserContacts[contact].email,
          relation: allUserContacts[contact].relation,
          phone: allUserContacts[contact].phone,
          url: allUserContacts[contact].url,
          notes: allUserContacts[contact].notes,
        }
        contacts.push(thisContact);
      }
    }).then(() => {
      this.setState({
        userContacts: contacts,
      })
    });
  }

  mountJobs = (user) => {

    let list = [];
    var appScore = 0;
    var savedScore = 0;
    var offerScore = 0;
    var today = getTodayDate();
    // DB ref
    let jobsRef = firebase.database().ref('jobs').child(user.uid);

    jobsRef.once('value', (data) => {
      let allJobs = data.val();
      for (var job in allJobs) {
        var currJob = {
          id: job,
          name: allJobs[job].name,
          company: allJobs[job].company,
          dateApplied: allJobs[job].dateApplied,
          dateCreated: allJobs[job].dateCreated,
          url: allJobs[job].url,
          offer: allJobs[job].offer,
          notes: allJobs[job].notes,
        }
        list.push(currJob); // Add job to list

        if (currJob.dateCreated) {
          var numDaysSinceAdd = getNumDaysApart(currJob.dateCreated, today);
          if (numDaysSinceAdd <= 7) {
            savedScore++;
          }
        }
        if (currJob.dateApplied) {
          var numDaysSinceApp = getNumDaysApart(currJob.dateApplied, today);
          if (numDaysSinceApp <= 7) {
            appScore++;
          }
        }
        if (currJob.offer === "1") {
          offerScore++;
        }
      }
    }).then(() => {
      this.setState({
        jobs: list,
        AppScore: appScore,
        SaveScore: savedScore,
        OfferScore: offerScore,
      })
    });
  }

  getContactScore = () => {
    // Contact Scores
    // var outreachScore = 0;
    // var contactScore = 0;
    return null;
  }

  SummaryTable = () => {
    return (
      <div className="container-fluid">
        <div className="row">
          <CompaniesScoreCard
            Link="/Companies/"
            CompanyScore={this.state.CompanyScore}
            TotalCompanyScore={this.state.TotalCompanyScore} />
          <JobScoreCard
            Link="/Jobs/"
            AppScore={this.state.AppScore}
            OfferScore={this.state.OfferScore} />
          <ContactScoreCard
            Link="/"
            ContactScore={0}
            OutreachScore={0} />
        </div>
      </div>
    )
  }

  // Render
  render() {
    return (
      <div className="App-body">
        <div className="container-banner container-banner-shift container-banner-height my-color">
          <div className="align-center-block text-wrapper fit">
            <h1 className="text-title">Launch Your Job Hunt.</h1>
          </div>
        </div>
        <div className="container-body container-body-shift">
          {this.SummaryTable()}
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
