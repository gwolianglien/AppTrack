import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import firebase from '../Fire';

import {
  // For Main Page Controls and Forms
  Navigator, FormInputAttribute, FormTextAreaAttribute,

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

// class CompaniesOld extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: true,
//       authenticated: null,
//       user: null,
//       userCompanies: [],
//       userCompaniesMap: {},
//       userJobs: [],
//       userContacts: [],
//     }
//   }
//
//   componentDidMount() {
//     this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         this.mountUserData(user);
//         this.setState({
//           loading: false,
//           authenticated: true,
//         });
//       } else {
//         this.routeHome();
//         this.setState({
//           loading: false,
//           authenticated: false,
//         });
//       }
//     });
//   }
//
//   // Database Read Functions
//   mountUserData = (user) => {
//     /*
//     Goal here is to load all user data, and aggregate user companies, contacts, and jobs.
//     */
//
//     // Load and retrieve all companies for this user
//     let companiesRef = firebase.database().ref('companies').child(user.uid);
//     let companies = [];
//     let companiesMap = {};
//     companiesRef.once('value', (data) => {
//       let allUserCompanies = data.val();
//       var i = 0;
//       for (var company in allUserCompanies) {
//         var thisCompany = {
//           id: company,
//           name: allUserCompanies[company].name,
//           notes: allUserCompanies[company].notes,
//           jobs: [],
//           contacts: [],
//         }
//         companies.push(thisCompany);
//         companiesMap[thisCompany.name.toUpperCase()] = i;
//         i += 1;
//       }
//     });
//
//     // Load and aggregate user contacts to current list of companies
//     let contactsRef = firebase.database().ref('contacts').child(user.uid);
//     contactsRef.once('value', (data) => {
//       let allUserContacts = data.val();
//       for (var contact in allUserContacts) {
//
//         if (allUserContacts[contact].company.toUpperCase() in companiesMap) {
//           var thisContact = {
//             id: contact,
//             name: allUserContacts[contact].name,
//             company: allUserContacts[contact].company,
//             title: allUserContacts[contact].title,
//             email: allUserContacts[contact].email,
//             phone: allUserContacts[contact].phone,
//             relation: allUserContacts[contact].relation,
//             url: allUserContacts[contact].url,
//             notes: allUserContacts[contact].notes,
//           };
//           var key = companiesMap[thisContact.company.toUpperCase()];
//           var thisCompanyRef = companies[key];
//           thisCompanyRef.contacts.push(thisContact);
//         }
//       }
//     });
//
//     // Load and aggregate user jobs to current list of companies
//     let jobsRef = firebase.database().ref('jobs').child(user.uid);
//     jobsRef.once('value', (data) => {
//       let allUserJobs = data.val();
//       for (var job in allUserJobs) {
//
//         if(allUserJobs[job].company.toUpperCase() in companiesMap) {
//           var thisJob = {
//             id: job,
//             name: allUserJobs[job].name,
//             company: allUserJobs[job].company,
//             url: allUserJobs[job].url,
//             deadline: allUserJobs[job].deadline,
//             notes: allUserJobs[job].notes,
//           }
//           var key = companiesMap[thisJob.company.toUpperCase()];
//           var thisCompanyRef = companies[key]
//           thisCompanyRef.jobs.push(thisJob);
//         }
//       }
//     }).then(() => this.setState({
//       userCompanies: companies,
//       user: user,
//     }));
//   }
//
//   removeCompany = (companyID) => {
//     let userCompanyDBRef = firebase.database().ref('companies').child(this.state.user.uid).child(companyID);
//     userCompanyDBRef.remove().then(() => this.refreshWindow());
//   }
//
//   refreshWindow = () => {
//     window.location.reload();
//   }
//
//   // Route functions
//   routeHome = () => {
//     this.props.history.push('/');
//   }
//   routeCompanies = () => {
//     this.props.history.push('/Companies');
//   }
//   routeContacts = () => {
//     this.props.history.push('/Contacts');
//   }
//   routeJobs = () => {
//     this.props.history.push('/Jobs');
//   }
//   routeAddCompany = () => {
//     this.props.history.push('/Add/Company');
//   }
//
//
//   mapUserContacts = (contactsArray) => {
//     return (
//       contactsArray.map((contact, j) => {
//         return (
//           <li className="list-group-item" key={j}>{contact.name}</li>
//         );
//       })
//     )
//   }
//
//   mapUserJobs = (jobsArray) => {
//     return (
//       jobsArray.map((job, k) => {
//         return (
//           <li className="list-group-item" key={k}>{job.name}</li>
//         );
//       })
//     )
//   }
//
//   // Render functions
//   CompanyList = () => {
//     return (
//       this.state.userCompanies.map((company, i) => {
//         return (
//           <div key={i} className="col-lg-6">
//             <div className={`card border-success`}>
//               <div className="card-body">
//                 <div className="card-header">
//                   <h5 className="card-title">{company.name}</h5>
//                   {company.notes ? <p className="card-text">{company.notes}</p> : null}
//                 </div>
//
//                 <div className="collapse" id={`collapse-detail-${i}`}>
//                   {company.jobs.length > 0 ?
//                     <div className="card card-body">
//                       <div className="card-header">
//                         <h5 onClick={() => this.routeJobs()}>Your Saved Jobs:</h5>
//                       </div>
//                       <ul className="list-group list-group-flush">
//                         {this.mapUserJobs(company.jobs)}
//                       </ul>
//                     </div>
//                     :
//                     null
//                   }
//                 </div>
//
//                 <div className="collapse" id={`collapse-detail-${i}`}>
//                   {company.contacts.length > 0 ?
//                     <div className="card card-body">
//                       <div className="card-header">
//                         <h5>Your Contacts:</h5>
//                       </div>
//                       <ul className="list-group list-group-flush">
//                         {this.mapUserContacts(company.contacts)}
//                       </ul>
//                     </div>
//                     :
//                     null
//                   }
//                 </div>
//                 {this.RenderControls(company, i)}
//               </div>
//             </div>
//           </div>
//         )
//       })
//     );
//   }
//
//   RenderControls = (company, i) => {
//     return (
//       <div className="row">
//         <div className="container-fluid">
//           <div className="btn-group d-none d-md-flex justify-content-center">
//             <button className="btn btn-primary col-lg-12" type="button" data-toggle="collapse" data-target={`#collapse-detail-${i}`} aria-expanded="false" aria-controls={`collapse-detail-${i}`}>
//               Expand
//             </button>
//             <button className="btn btn-danger col-lg-12" type="button" onClick={() => this.removeCompany(company.id)}>
//               Remove
//             </button>
//           </div>
//           <div className="dropdown d-md-none">
//             <button className="btn btn-info dropdown-toggle col-lg-12" type="button" data-toggle="dropdown">Action</button>
//             <div className="dropdown-menu">
//               <button className="btn btn-primary col-lg-12" type="button" data-toggle="collapse" data-target={`#collapse-detail-${i}`} aria-expanded="false" aria-controls={`collapse-detail-${i}`}>
//                 Expand
//               </button>
//               <button className="btn btn-danger col-lg-12" type="button" onClick={() => this.removeCompany(company.id)}>
//                 Remove
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }
//
//   CompanyWrapper = () => {
//     return (
//       <div className="container-fluid row card-columns d-flex flex-wrap">
//         {this.CompanyList()}
//       </div>
//     )
//   }
//
//   render() {
//     return (
//       <div className="App-layer">
//         <div className="App-banner align-center-all">
//           <h1>Make your Dream Company a Reality.</h1>
//         </div>
//         <div className="App-body">
//           <div className="App-controls">
//             <div className="container-fluid">
//               <div className="btn-group d-none d-md-flex justify-content-center align-center">
//                 <button className="btn btn-primary btn-lg" type="button" onClick={() => this.routeAddCompany()}>
//                   Add Your Target Company
//                 </button>
//                 <button className="btn btn-warning btn-lg" type="button">
//                   Need Help Choosing?
//                 </button>
//               </div>
//               <div className="dropdown d-md-none">
//                 <button className="btn btn-info dropdown-toggle col-lg-12" type="button" data-toggle="dropdown">Action</button>
//                 <div className="dropdown-menu">
//                   <div className="container-fluid">
//                     <button className="btn btn-primary col-lg-12" type="button" onClick={() => this.routeAddCompany()}>
//                       Add Your Target Company
//                     </button>
//                     <button className="btn btn-warning col-lg-12" type="button">
//                       Need Help Choosing?
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {this.state.userCompanies.length > 0 ?
//             <div className="App-content">
//               {this.CompanyWrapper()}
//             </div>
//             :
//             <div className="App-content">
//               <h2>You Haven't Added Any Companies Yet!</h2>
//             </div>
//           }
//         </div>
//       </div>
//     )
//   }
// }

const Banner = (props) => {
  return (
    <div className="container-banner container-banner-shift container-banner-height my-color">
      <div className="align-center-block text-wrapper fit">
        <h1 className="text-title">{props.Text}</h1>
      </div>
    </div>
  )
}

const Body = (props) => {
  return (
    <table className="table table-lg">
      <thead className="thead-light">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Something</th>
          <th scope="col">Something</th>
        </tr>
      </thead>
      <tbody>
        {props.companiesList.map((company, i) => {
          // variables can go here
          return (
            <tr>
              <th scope="row">{i}</th>
              <td>{company.name}</td>
              <td>{company.url}</td>
              <td>{company.notes}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

class Companies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticated: null,
      user: null,
      companies: [],
    }
  }

  componentDidMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {

        // Load and retrieve all companies for this user
        let companiesRef = firebase.database().ref('companies').child(user.uid);
        let list = [];

        companiesRef.once('value', (data) => {
          let allData = data.val();
          for (var company in allData) {
            var curr = {
              id: company,
              name: allData[company].name,
              notes: allData[company].notes,
              url: allData[company].url,
            }
            list.push(curr);
          }
        }).then(() =>
          this.setState({
            loading: false,
            authenticated: true,
            user: user,
            companies: list,
          })
        );
      } else {
        this.setState({
          loading: false,
          authenticated: false,
        });
      }
    });
  }

  /* State and Screen Change Functions */
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

  /* Add Company Form */
  CompanyAddForm = () => {
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


  render() {
    return (
      <div className="App-body">
        <Banner
          Text={"Where Do You Envision Yourself?"} />
        <div className="container-body container-body-shift">
          <Navigator
            add="Add a Company!"
            />
          <Body
            companiesList={this.state.companies}
            />
        </div>
      </div>
    )
  }
}

export default withRouter(Companies);
