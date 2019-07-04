import React from 'react';
import { Link } from 'react-router-dom';
import firebase from '../Fire';

export const FormInputAttribute = (props) => {
  /*
  idName: unique identifier for the form
  type: the type of form (text, date, etc.)
  title: the text that will appear over the form
  placeholder: the text that appears inside the form
  stateVal: the default valule
  handleChange: function to handle change upon submit
  */
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
  /*
  idName: unique identifier for the form
  type: the type of form (text, date, etc.)
  title: the text that will appear over the form
  placeholder: the text that appears inside the form
  stateVal: the default valule
  handleChange: function to handle change upon submit
  */
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

export const RadioButton = (props) => {
  return (
    <div className="form-check">
      <input className="form-check-input" type="radio" name={`{props.name}`} id={`{props.id}`} value={`{props.val}`} checked />
      <label className="form-check-label" for={`{props.id}`}>
        {props.input}
      </label>
    </div>
  )
}
