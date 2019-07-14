import React from 'react';
import { Link } from 'react-router-dom';

import {
  getJobAppDate, getJobSaveDate, getJobTitle,
} from './MyFunctions';



/* Common Components */
export const Banner = (props) => {
  return (
    <div className="App-banner align-center-all">
      <h1>{props.headline}</h1>
    </div>
  )
}

/* Pages used: Jobs, Contacts, and Companies */
export const Navigator = (props) => {
  return (
    <div className="container-fluid">
      <div className="btn-group d-none d-md-flex justify-content-center align-center">
        {props.add ?
          <button className="btn btn-primary btn-lg" type="button" data-toggle="collapse"
            data-target="#add-form" aria-expanded="false" aria-controls="add-form">
            {props.add}
          </button>
          :
          null
        }
        {props.help ?
          <button className="btn btn-success btn-lg" type="button" onClick={props.routeHelp}>
            {props.help}
          </button>
          :
          null
        }
        {props.archive ?
          <button className="btn btn-info btn-lg" type="button" onClick={props.routeArchive}>
            {props.archive}
          </button>
          :
          null
        }
      </div>
      <div className="dropdown d-md-none">
        <button className="btn btn-info dropdown-toggle col-lg-12" type="button" data-toggle="dropdown">Action</button>
        <div className="dropdown-menu">
          <div className="container-fluid">
            {props.add ?
              <button className="btn btn-primary btn-lg col-lg-12" type="button" data-toggle="collapse"
                data-target="#add-form" aria-expanded="false" aria-controls="add-form">
                {props.add}
              </button>
              :
              null
            }
            {props.help ?
              <button className="btn btn-success btn-lg col-lg-12" type="button" onClick={props.routeHelp}>
                {props.help}
              </button>
              :
              null
            }
            {props.archive ?
              <button className="btn btn-info btn-lg col-lg-12" type="button" onClick={props.routeArchive}>
                {props.archive}
              </button>
              :
              null
            }
          </div>
        </div>
      </div>
    </div>
  )
}

/*
Pages used: Home
*/
export const MyProgress = (props) => {
  /*
  title: Title of the card
  type: job apps or contacts
  weekProgress: number of apps or emails this week
  monthProgress: number of apps or emails this month
  */
  return (
    <div className="card border-dark">
      <div className="card-body">
        <Link to={`${props.route}`} className="card-link">
          <div className="card-header">
            <h5 className="card-title">{props.title}</h5>
          </div>
        </Link>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Your {props.type} score this week: {props.weekProgress}</li>
          <li className="list-group-item">Your {props.type} score this month: {props.monthProgress}</li>
        </ul>
      </div>
    </div>
  )
}

export const MySaved = (props) => {
  return (
    <div className="card border-dark">
      <div className="card-body">
        <Link to={`${props.route}`} className="card-link">
          <div className="card-header">
            <h5 className="card-title">{props.title}</h5>
          </div>
        </Link>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">You've saved {props.numSaved} {props.type}</li>
          <li className="list-group-item">You added {props.numNew} {props.type} this month</li>
        </ul>
      </div>
    </div>
  )
}

/*
Pages used: Jobs
*/

export const JobCardHeader = (props)  => {
  var currId = props.CardBodyId;  // CardBodyId: data-target ID to show job details
  var appDate = getJobAppDate(props.job);
  var title = getJobTitle(props.job);
  var offer = props.job.offer;

  return (
    <div className="card-header card-header-effects" data-toggle="collapse" data-target={`#${currId}`}
          aria-expanded="false" aria-controls={currId}>
      <h5 className="card-title">{title}</h5>
      {offer ?
        <p className="card-text">
          {offer === "1" ?
            "Congratulations! You received an offer!"
            :
            "You didn't get an offer! :("
          }
        </p>
        :
        <p className="card-text">
          {appDate}
        </p>
      }
    </div>
  )
}

export const JobCardBody = (props) => {
  var currType = props.type;
  if (currType === "RecentApp") {
    return RecentApp(props);
  } else if (currType === "Saved") {
    return SavedJob(props);
  } else if (currType === "Offer") {
    return Offer(props);
  }
  else {
    throw Error("Unknown Card Body Type");
  }
}

const Offer = (props) => {
  var saveDate = getJobSaveDate(props.job);
  var appDate = getJobAppDate(props.job);
  return (
    <div className="collapse" id={`${props.CardBodyId}`}>
      <div className="card card-body">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">{appDate}</li>
          <li className="list-group-item">{saveDate}</li>
          {props.job.url ? <li className="list-group-item">{props.job.url}</li> : null}
          {props.job.notes ? <li className="list-group-item">{props.job.notes}</li> : null}
          <li className="list-group-item">{JobCardControls(props)}</li>
        </ul>
      </div>
    </div>
  )
}
const RecentApp = (props) => {
  var saveDate = getJobSaveDate(props.job);
  return (
    <span>
      <div className="collapse" id={`${props.CardBodyId}`}>
        <div className="card card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">{saveDate}</li>
            {props.job.url ? <li className="list-group-item">{props.job.url}</li> : null}
            {props.job.notes ? <li className="list-group-item">{props.job.notes}</li> : null}
            <li className="list-group-item">{JobCardControls(props)}</li>
          </ul>
        </div>
      </div>
      <div className="collapse" id={`${props.ShowResultsId}`}>
        <div className="card card-body">
          <form onSubmit={props.HandleSubmit}>
            <div className="container-fluid radio-form-group">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label htmlFor="offer">
                      Did you get an offer?
                    </label>
                    <select
                      className="form-control"
                      id="offer"
                      name="offer"
                      value={props.StateValue}
                      onChange={props.HandleChange}>
                      <option>(Select)</option>
                      <option value={1}>Yes!</option>
                      <option value={0}>No :(</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="btn-group d-none d-md-flex justify-content-center">
              <button className="btn btn-success" onClick={props.Update}>
                Update!
              </button>
            </div>
          </form>
        </div>
      </div>
    </span>
  )
}
const SavedJob = (props) => {
  var saveDate = getJobSaveDate(props.job);
  return (
    <span>
      <div className="collapse" id={props.CardBodyId}>
        <div className="card card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">{saveDate}</li>
            {props.job.url ? <li className="list-group-item">{props.job.url}</li> : null}
            {props.job.notes ? <li className="list-group-item">{props.job.notes}</li> : null}
          </ul>
          <div className="btn-group d-none d-md-flex justify-content-center">
            <button className="btn btn-info" type="button" onClick={props.UpdateDetails}>
              Update Details
            </button>
          </div>
        </div>
      </div>
      <div className="collapse" id={props.ShowAppId}>
        <div className="card card-body">
          <form onSubmit={props.HandleSubmit}>
            <div className="row">
              <div className="col-lg-12">
                <FormInputAttribute idName="jobAppDate" type="date" title="When did you apply?" placeholder="When did you apply?" stateVal={props.StateValue} handleChange={props.HandleChange} />
              </div>
            </div>
            <div className="btn-group d-none d-md-flex justify-content-center">
              <button className="btn btn-success" type="button" onClick={props.UpdateApp}>
                Congrats on Applying!
              </button>
            </div>
          </form>
        </div>
      </div>
    </span>
  )
}

export const JobCardControls = (props) => {
  return (
    <div className="form-controls">
      <div className="row">
        <div className="container-fluid">
          <div className="btn-group d-none d-md-flex justify-content-center">
            {props.ShowAppliedButton ? AppliedButton(props) : null}
            {props.ShowResultsButton ? ResultsButton(props) : null}
            {props.ShowRemoveButton ? RemoveButton(props) : null}
          </div>
        </div>
      </div>
      <div className="dropdown d-md-none">
        <button className="btn btn-secondary col-lg-12 dropdown-toggle" type="button" data-toggle="dropdown">Action</button>
        <div className="dropdown-menu">
          {props.ShowAppliedButton ? AppliedButton(props) : null}
          {props.ShowResultsButton ? ResultsButton(props) : null}
          {props.ShowRemoveButton ? RemoveButton(props) : null}
        </div>
      </div>
    </div>
  )
}

const AppliedButton = (props) => {
  return (
    <button className="btn btn-primary" type="button"
      data-toggle="collapse" data-target={`#${props.ShowAppId}`}
      aria-expanded="false" aria-controls={props.ShowAppId}>
      Did You Apply Yet?
    </button>
  )
}
const ResultsButton = (props) => {
  return (
    <button className="btn btn-primary" type="button"
      data-toggle="collapse" data-target={`#${props.ShowResultsId}`}
      aria-expanded="false" aria-controls={props.ShowResultsId}>
      Did You Hear Back Yet?
    </button>
  )
}
const RemoveButton = (props) => {
  return (
    <button className="btn btn-danger" type="button"
      onClick={props.Remove}>
      Remove
    </button>
  )
}

/*
Form Attributes and Inputs
*/
export const FormInputAttribute = (props) => {
  return (
    <div className="form-group">
      <label htmlFor={`${props.idName}`}>{props.title}:</label>
      <input className="form-control"
        type={`${props.type}`}
        id={`${props.idName}`}
        name={`${props.idName}`}
        placeholder={`${props.placeholder}`}
        value={props.stateVal}
        onChange={props.handleChange}
      />
    </div>
  );
}
export const FormTextAreaAttribute = (props) => {
  return (
    <div className="form-group">
      <label htmlFor={`${props.idName}`}>{props.title}:</label>
      <textarea className="form-control"
        rows="1"
        id={`${props.idName}`}
        name={`${props.idName}`}
        placeholder={`${props.placeholder}`}
        value={props.stateVal}
        onChange={props.handleChange}
      />
      <br />
    </div>
  );
}
export const RadioInput = (props) => {
  return (
    <div className="form-check">
      <input className="form-check-input" type="radio"
        id={`${props.id}`}
        name={`${props.name}`}
        value={`${props.stateVal}`}
        onChange={props.handleChange}
        checked={props.checkVal}
      />
      <label className="form-check-label" htmlFor={`${props.id}`}>
        {props.input}
      </label>
    </div>
  )
}
