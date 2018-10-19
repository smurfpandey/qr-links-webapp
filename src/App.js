import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';

import Peer from 'simple-peer';
import openSocket from 'socket.io-client';

import Topbar from './components/topbar';
import PairWithExtension from './components/pair-with-extension';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.webPeer = null;

    this.handleWebRTCSignal = this.handleWebRTCSignal.bind(this);
    this.whenSocketIsReady = this.whenSocketIsReady.bind(this);
  }

  handleWebRTCSignal = async (offer) => {
    this.setState({ offer: offer });
    this.socket.emit('offer', offer, (data) => {
      this.setState({ peerId: data.id });
      localStorage.setItem('peer-id', data.id);
    });
  } 

  whenSocketIsReady() {
    // attach listeners
    // if(!this.webPeer) {
    //   this.webPeer = new Peer({ initiator: true, trickle: false });
    //   this.webPeer.on('signal', this.handleWebRTCSignal);
    // }        
  }

  componentDidMount() {
    this.socket = openSocket('http://localhost:5000');
    this.socket.on('ready', this.whenSocketIsReady);
  }

  render() {
    return (
      <div className="App">
        <Topbar />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <PairWithExtension />
      </div>
    );
  }
}

export default App;
