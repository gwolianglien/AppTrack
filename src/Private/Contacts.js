import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import firebase from '../Fire';

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticated: null,
      user: null,
      userContacts: [],
    }
  }

  componentDidMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var userContactsRef = firebase.database().ref('contacts').child(`${user.uid}`);
        var contactsList = [];
        userContactsRef.once('value', (data) => {
          let allContacts = data.val();
          for (let contact in allContacts) {
            let thisContact = {
              id: contact,
              name: allContacts[contact].name,
              phone: allContacts[contact].phone,
              company: allContacts[contact].company,
              email: allContacts[contact].email,
              relation: allContacts[contact].relation,
              url: allContacts[contact].url,
              title: allContacts[contact].title,
              notes: allContacts[contact].notes,
            }
            contactsList.push(thisContact);
          }
        }).then(() => this.setState({
            loading: false,
            authenticated: true,
            user: user,
            userContacts: contactsList,
          })
        );
      } else {
        this.setState({
          loading: false,
          authenticated: false,
        });
        this.routeHome();
      }
    });
  }

  removeContact = (contactID) => {
    let userContactDBRef = firebase.database().ref('contacts').child(this.state.user.uid).child(contactID);
    userContactDBRef.remove().then(() => this.refreshWindow());
  }

  refreshWindow = () => {
    window.location.reload();
  }

  checkSuppContactAttr = (contact) => {
    return contact.title || contact.relation || contact.phone || contact.email || contact.url || contact.notes;
  }

  // Route functions
  routeHome = () => {
    this.props.history.push('/');
  }
  routeContacts = () => {
    this.props.history.push('/Contacts');
  }
  routeJobs = () => {
    this.props.history.push('/Jobs');
  }
  routeAddContact = () => {
    this.props.history.push('/Add/Contact');
  }
  routeUpdateContact = (contactID) => {
    this.props.history.push(
      '/Update/Contact',
      { id: contactID }
    );
  }

  // Render functions
  PageControls = () => {
    return (
      <div className="container-fluid">
        <div className="btn-group d-none d-md-flex justify-content-center align-center">
          <button className="btn btn-primary btn-lg" type="button" onClick={() => this.routeAddContact()}>
            Add Your Connections
          </button>
          <button className="btn btn-warning btn-lg" type="button">
            Need Help Choosing?
          </button>
        </div>
        <div className="dropdown d-md-none">
          <button className="btn btn-info dropdown-toggle col-lg-12" type="button" data-toggle="dropdown">Action</button>
          <div className="dropdown-menu">
            <div className="container-fluid">
            <button className="btn btn-primary col-lg-12" type="button" onClick={() => this.routeAddContact()}>
              Add Your Connections
            </button>
            <button className="btn btn-warning col-lg-12" type="button">
              Need Help Choosing?
            </button>
          </div>
          </div>
        </div>
      </div>
    )
  }

  ContactsList = () => {
    return (
      this.state.userContacts.map((contact, i) => {
        return (
          <div key={i} className="col-lg-6">
            <div className={`card border-success`}>
              <div className="card-body">
                <div className="card-header">
                  <h5 className="card-title">{contact.name}</h5>
                  <h7>{this.FormTitle(contact)}</h7>
                </div>
                <div className="collapse" id={`collapse-detail-${i}`}>
                  {(contact.phone || contact.email || contact.url || contact.company || contact.title) ?
                    <div className="card card-body">
                      <ul className="list-group list-group-flush">
                        {contact.email ? <li className="list-group-item"><a href={`mailto:${contact.email}`}>{contact.email}</a></li> : null}
                        {contact.phone ? <li className="list-group-item">{contact.phone}</li> : null}
                        {contact.relation? <li className="list-group-item">{contact.relation}</li> : null}
                        {contact.url ? <li className="list-group-item">{contact.url}</li> : null}
                        {contact.notes ? <li className="list-group-item">{contact.notes}</li> : null}
                      </ul>
                      <div>
                        <div className="btn-group d-none d-md-flex justify-content-center">
                          <button className="btn btn-success" type="button" onClick={() => this.routeUpdateContact(contact.id)}>
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                    :
                    null
                  }
                </div>
                {this.FormControls(contact, i)}
              </div>
            </div>
          </div>
        )
      })
    );
  }

  FormTitle = (contact) => {
    if (contact.company && contact.title) {
      return `${contact.title} at ${contact.company}`;
    } else if (contact.company && !contact.title) {
      return `${contact.company}`;
    } else if (!contact.company && contact.title) {
      return `${contact.title}`;
    } else {
      return null;
    }
  }

  FormControls = (contact, i) => {
    let hasSuppContactAttr = this.checkSuppContactAttr(contact);
    return (
      <div className="row">
        <div className="container-fluid">
          <div className="btn-group d-none d-md-flex justify-content-center">
            {hasSuppContactAttr ?
              <button className="btn btn-primary" type="button" data-toggle="collapse" data-target={`#collapse-detail-${i}`} aria-expanded="false" aria-controls={`collapse-detail-${i}`}>
                Expand
              </button>
              :
              <button className="btn btn-success" type="button" onClick={() => this.routeUpdateContact(contact.id)}>
                Update
              </button>
            }
            <button className="btn btn-danger" type="button" onClick={() => this.removeContact(contact.id)}>
              Remove
            </button>
          </div>
          <div className="dropdown d-md-none">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">Action</button>
            <div className="dropdown-menu">
              {hasSuppContactAttr ?
                <button className="btn btn-primary" type="button" data-toggle="collapse" data-target={`#collapse-detail-${i}`} aria-expanded="false" aria-controls={`collapse-detail-${i}`}>
                  Expand
                </button>
                :
                <button className="btn btn-success" type="button" onClick={() => this.routeUpdateContact(contact.id)}>
                  Update
                </button>
              }
              <button className="btn btn-danger" type="button" onClick={() => this.removeContact(contact.id)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  ContactsWrapper = () => {
    return (
      <div className="container-fluid row card-columns d-flex flex-wrap">
        {this.ContactsList()}
      </div>
    )
  }

  render() {
    return (
      <div className="App-layer">
        <div className="App-banner align-center-all">
          <h1>Connections Break Down Front Doors.</h1>
        </div>
        <div className="App-body">
          <div className="App-controls">
            {this.PageControls()}
          </div>
          {this.state.userContacts.length > 0 ?
            <div className="App-content">
              {this.ContactsWrapper()}
            </div>
            :
            <div className="App-content">
              <h2>You haven't added any contacts yet!</h2>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default withRouter(Contacts);
