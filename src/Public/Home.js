import React from 'react';
import ListLogo from './Img/List.png';
import SearchLogo from './Img/Search.png';
import InstructionLogo from './Img/Instruction.png';

export const Banner = () => {
  return (
    <div className="container-banner container-banner-shift container-banner-height my-color">
      <div className="align-center-block text-wrapper fit">
        <h1 className="text-title">Start Your Job Hunt with <strong>AppTrack</strong></h1>
        <h3 className="text-subtitle">The Better Way to Track Your Career Launch</h3>
      </div>
    </div>
  )
}

export const Body = () => {
  return (
    <div className="container-body container-body-shift">
      <div className="container-fluid">
        <div class="card-group">
          <div class="card">
            <img class="card-img-top card-img-size" src={SearchLogo} alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">Save Your Favorite Companies</h5>
              <p class="card-text">There are a ton of opportunities. Save and set a reminder for yourself to look into your favorite companies!</p>
            </div>
          </div>
          <div class="card">
            <img class="card-img-top card-img-size" src={InstructionLogo} alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">Track Your Job Applications</h5>
              <p class="card-text">Organization is key. Follow through and track </p>
            </div>
          </div>
          <div class="card">
            <img class="card-img-top card-img-size" src={ListLogo} alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">Reach Out to Your Contacts</h5>
              <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Home = () => {
  return (
    <div className="App-body">
      <Banner />
      <Body />
    </div>
  )
}

export default Home;
