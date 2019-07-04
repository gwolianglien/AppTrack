import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebase from '../Fire';

import {
  getTodayDate, getNumDaysApart,

  routeJobs,
} from './MyFunctions';

import {
  MyProgress, MySaved
} from './MyComponents';

export const ScoreCard = (props) => {

  var keyword1, keyword2, keyword3;
  var currType = props.type;
  if (currType === "Jobs") {
    keyword1 = "App";
    keyword2 = "Jobs";
  } else if (currType === "Contacts") {
    keyword1 = "Contact";
    keyword2 = "Contacts";
    keyword3 = "Outreach"
  } else {
    throw Error("Unaccounted Score Card type")
  }

  return (
    <div className="col-lg-4">
      <div className="card border-dark">
        <Link className="card-link" to={() => routeJobs()}>
          <div className="card-header">
            <h5 className="card-title">Your Weekly {keyword1} Score</h5>
          </div>
        </Link>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Your {keyword2} Score: {props.JobScore}</li>
          <li className="list-group-item">Your {keyword1} Score: {props.AppScore}</li>
        </ul>
      </div>
    </div>
  )
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      user: null,
      userCompanies: [],
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
        });
      } else {
        this.setState({
          authenticated: false,
        });
      }
    })
  }

  // Database Read Functions
  mountUserData = (user) => {
    this.mountCompanies(user);
    this.mountUserContacts(user);
    this.mountUserJobs(user);
  }

  mountCompanies = (user) => {
    let companiesRef = firebase.database().ref('companies').child(user.uid);
    let companies = []
    companiesRef.once('value', (data) => {
      let allUserCompanies = data.val();
      for (var company in allUserCompanies) {
        var thisCompany = {
          id: company,
          name: allUserCompanies[company].name,
          notes: allUserCompanies[company].notes
        }
        companies.push(thisCompany);
      }
    }).then(() => {
      this.setState({
        userCompanies: companies,
      })
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

  mountUserJobs = (user) => {
    let jobsRef = firebase.database().ref('jobs').child(user.uid);
    let myJobs = []
    jobsRef.once('value', (data) => {
      let allJobs = data.val();
      for (var job in allJobs) {
        var thisJob = {
          id: job,
          name: allJobs[job].name,
          company: allJobs[job].company,
          dateApplied: allJobs[job].dateApplied,
          dateCreated: allJobs[job].dateCreated,
          url: allJobs[job].url,
          offer: allJobs[job].offer,
          notes: allJobs[job].notes,
        }
        myJobs.push(thisJob);
      }
    }).then(() => {
      this.setState({
        jobs: myJobs,
      })
    });
  }

  updateScores = () => {

    var appScore = 0;
    var savedScore = 0;
    var today = getTodayDate();

    for (var job in this.state.jobs) {

      var createDate = job.dateCreated;
      var appDate = job.dateApplied;

      // Possible error from creating job, and not storing date created
      if (!createDate) {
        continue;
      }

      var numDaysSinceAdd = getNumDaysApart(createDate, today);
      if (numDaysSinceAdd <= 7) {
        savedScore++;
      }

      if (!appDate) {
        continue;
      }

      var numDaysSinceApp = getNumDaysApart(appDate, today);
      if (numDaysSinceApp <= 7) {
        appScore++;
      }
    }

    try {
      this.setState({
        score1: appScore,
        score2: savedScore,
      });
    } catch {
      throw Error("Failure updating state");
    }

  }

  SummaryTable = () => {
    return (
      <div className="container-fluid">
        <div className="row">
          <ScoreCard
            type="Jobs"
            JobScore={this.state.score2}
            AppScore={this.state.score1} />
        </div>
      </div>
    )
  }

  // Render
  render() {
    return (
      <div className="App-body">
        <div className="App-banner align-center-all">
          <h1>Launch Your Job Hunt.</h1>
        </div>
        <div className="App-content">
          {this.SummaryTable()}
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
