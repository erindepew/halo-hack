import React, { PureComponent} from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import {Type} from '@spotify-internal/creator-tape'
import {white} from '@spotify-internal/tokens/creator/web/tokens.common';
import queryString from 'query-string';
import { Wrapper} from './styled';
import Halo from './Halo';
import Form from './Form';
import { clientId } from './config';
import * as api from './api';
import SpotifyWebApi from 'spotify-web-api-js';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false,
      audioFeatures: null,
      audioInfo: null,
    };
    this.appToken = clientId;
    this.redirectURI = encodeURIComponent(
      `${window.location.protocol }//${ window.location.host }/callback`
    );
    this.scopes = encodeURIComponent(
      'playlist-modify-public playlist-modify-private user-read-private streaming user-read-email user-read-birthdate user-modify-playback-state user-read-playback-state user-read-currently-playing user-read-recently-played',
    );
    this.loginLink = `https://accounts.spotify.com/authorize?client_id=${
      this.appToken}&redirect_uri=${this.redirectURI}&scope=${this.scopes}&response_type=token`;

    let tokenObject = {
      value: queryString.parse(window.location.hash).access_token,
      genDate: Date.now(),
    };
    // Get the login from the cache if necessary
    if (tokenObject.value) {
      this.setCurrentToken(tokenObject);
    } else {
      tokenObject = this.getCurrentToken();
    }

    if (tokenObject && tokenObject.value) {
      if (tokenObject.genDate <= Date.now() - 3600000) {
        this.removeCurrentToken();
      } else {
        this.state.userLoggedIn = true;
        window.location.hash = '';
        this.spotifyWebAPI = new SpotifyWebApi();
        this.spotifyWebAPI.setAccessToken(this.getCurrentToken().value);
      }
      // get user profile if token exists
      this.getUserProfile();
    } else {
      this.removeCurrentToken();
    }
  }

  setCurrentToken(tokenObject) {
    sessionStorage.setItem('tokenobject', JSON.stringify(tokenObject));
  }

  getCurrentToken() {
    return JSON.parse(sessionStorage.getItem('tokenobject'));
  }

  removeCurrentToken() {
    sessionStorage.removeItem('tokenobject');
  }

  getUserProfile() {
    const token = this.getCurrentToken();
    if (token) {
      api.getCurrentUserProfile(token.value).then((payload) => {
        const user = payload.data;
        this.setState({user});
      });
    }
  }

  getContentId = (value) => {
    const spotifyId = value.split(':')[2];
    return spotifyId;
  }

  getContentType = (value) => {
    const type = value.split(':')[1];
    return type;
  }

  getAudioFeatures = (value) => {
    const type = this.getContentType(value);
    const id = this.getContentId(value);
    if (type === "track") {
      this.spotifyWebAPI.getAudioFeaturesForTrack(id, (error, res) => {
          if (error) {
              return;
          }
          this.setState({audioFeatures: res});
      })
    }
    if (type === "artist") {
      this.spotifyWebAPI.getArtistTopTracks(id,"US", (error, res) => {
        if (error) {
            return;
        }
        this.getAudioFeaturesForTracks(res.tracks);
      });
    }
  }

  getAudioFeaturesForTracks = (tracks) => {
      const trackUris = tracks.map(track => this.getContentId(track.uri));
      this.spotifyWebAPI.getAudioFeaturesForTracks( trackUris, (error, res) => {
        if (error) {
            return;
        }

        this.setState({audioFeatures: this.averageAudioFeaturesForTracks(res.audio_features)});
      })
  };
  
  averageAudioFeaturesForTracks = (tracks) => {
    debugger;
    let average = {};
    const sum = tracks.reduce((a, b) => ({
      danceability: a.danceability + b.danceability,
      energy: a.energy + b.energy,
      key: a.key + b.key,
      loudness: a.loudness + b.loudness,
      mode: a.mode + b.mode,
      tempo: a.tempo + b.tempo}));
    Object.keys(sum).map((key) => { 
      average[key] = sum[key]/tracks.length});
    return average;
  }

  getAudioInfo = async (value) => {
    const type = this.getContentType(value);
    const id = this.getContentId(value);
    if (type === "track") {
      this.spotifyWebAPI.getTrack(id, (error, res) => {
          if (error) {
              return;
          }
          this.setState({audioInfo: res, type});
        });
      }
    if (type === "artist") {
      this.spotifyWebAPI.getArtist(id, (error, res) => {
        if (error) {
            return;
        }
        this.setState({audioInfo: res, type});
      });
    }
    }

  onSubmit = (value) => {
    this.getAudioFeatures(value);
    this.getAudioInfo(value);
  }

  render () {
    const {audioFeatures, audioInfo, userLoggedIn, type} = this.state;
    return ( 
    <Router>
      <Wrapper>
        {userLoggedIn ? <div>{audioFeatures ? 
        <Halo audioFeatures={audioFeatures} audioInfo={audioInfo} type={type}/> : 
        <Form onSubmit={this.onSubmit} />}</div>  : 

      <a href={this.loginLink}>
              <Type.h3 variant={Type.heading3} color={white}>Login with your Spotify Account</Type.h3>
        </a> }
      </Wrapper>
  </Router> );
  };
};