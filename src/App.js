import React, { PureComponent, useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import {FormInput, ButtonSecondary} from '@spotify-internal/creator-tape'
import queryString from 'query-string';
import { Wrapper} from './styled';
import { Store } from './store';
import Halo from './Halo';
import Form from './Form';
import {getApplicationToken} from './api';
import SpotifyWebApi from 'spotify-web-api-js';

export default class App extends PureComponent {
  state = {
    userLoggedIn: false,
    spotifyWebAPI: null,
    audioFeatures: null,
  };
  componentDidMount() {

    const appToken = 'c77c1f8d728e440785c65066549397b0';
    const redirectURI = encodeURIComponent(
      `https://example.com/callback`
    );
    // this.scopes = encodeURIComponent(
    //   'user-read-private playlist-read-private playlist-read-collaborative' +
    //     ' playlist-modify-private playlist-modify-public'
    // );
   

    // let tokenObject = {
    //   value: queryString.parse(window.location.hash).access_token,
    //   genDate: Date.now(),
    // };
    // debugger;
    // console.log(tokenObject.value);
    // // Get the login from the cache if necessary
    // if (tokenObject.value) {
    //   this.setCurrentToken(tokenObject);
    // } else {
    //   tokenObject = this.getCurrentToken();
    // }

    // if (tokenObject && tokenObject.value) {
    //   if (tokenObject.genDate <= Date.now() - 3600000) {
    //     this.removeCurrentToken();
    //   } else {
    //     this.setState({userLoggedIn: true});
    //     window.location.hash = '';
    //   }
    // } else {
    //   this.removeCurrentToken();
    // }

    // if (!this.state.userLoggedIn) {
    //   window.location.href = `https://accounts.spotify.com/authorize?client_id=${appToken}&redirect_uri=${redirectURI}&response_type=token`;
    // }

    const spotifyWebAPI = new SpotifyWebApi();
    spotifyWebAPI.setAccessToken('BQDGdKMsqaK5vP491aALzks_vbApIxxX2ioYjpCwllY9GQw5XA6iu_cp1wg0GkdtgHVs7gSNMvcpb8l0Zi3l1wUXhrzemUK-mN59h59A3LS5F0xiIFT7huv63oJDz70_e-ACCWxvSL53nJduRVxEyLK6AxOEMLJe7Q')
    this.setState({spotifyWebAPI})
  }

  getAudioFeatures = (value) => {
    const spotifyId = value.split(':')[2];
    const type = value.split(':')[1];
    if (type === "track") {
       this.state.spotifyWebAPI.getAudioFeaturesForTrack(spotifyId, (error, res) => {
           if (error) {
               console.log(error);
               return;
           }
           console.log(res);
           this.setState({audioFeatures: res});
        })
    }
}
  // setCurrentToken(tokenObject) {
  //   sessionStorage.setItem('tokenobject', JSON.stringify(tokenObject));
  // }
  // getCurrentToken() {
  //   debugger;
  //   return JSON.parse(sessionStorage.getItem('tokenobject'));
  // }

  // removeCurrentToken() {
  //   sessionStorage.removeItem('tokenobject');
  // }
  // let store = React.useContext(Store);
  // console.log(store)
    render () {
      return ( 
      <Router>
        <Wrapper>
          {this.state.audioFeatures ? 
               <Halo audioFeatures={this.state.audioFeatures}/> : 
          <Form onSubmit={this.getAudioFeatures} /> }
   
        {/* <ButtonSecondary onClick={this.loginLink}>
                Login with your Spotify Account
        </ButtonSecondary> */}
        </Wrapper>
    </Router> );
    };
};