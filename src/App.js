import React, { PureComponent} from 'react';
import {Banner} from '@spotify-internal/creator-tape'
import queryString from 'query-string';
import { Wrapper, StyledButtonPrimary} from './styled';
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
      error: '',
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
    this.setState({error: ''});
    if (type === "track") {
      this.spotifyWebAPI.getAudioFeaturesForTrack(id, (error, res) => {
          if (error) {
              this.setState({error});
              return;
          }
          this.setState({audioFeatures: res});
      })
    }
    if (type === "artist") {
      this.spotifyWebAPI.getArtistTopTracks(id,"US", (error, res) => {
        if (error) {
            this.setState({error});
            return;
        }
        this.getAudioFeaturesForTracks(res.tracks);
      });
    }
    else {
      this.setState({error: 'Not a valid track or artist spotify URI. Must be in "spotify:artist:{id}" or "spotify:track:{id}" format'});
    }
  }

  getAudioFeaturesForTracks = (tracks) => {
      const trackUris = tracks.map(track => this.getContentId(track.uri));
      this.setState({error: ''});
      this.spotifyWebAPI.getAudioFeaturesForTracks( trackUris, (error, res) => {
        if (error) {
            this.setState({error});
            return;
        }

        this.setState({audioFeatures: this.averageAudioFeaturesForTracks(res.audio_features)});
      })
  };
  
  averageAudioFeaturesForTracks = (tracks) => {
    let average = {};
    const sum = tracks.reduce((a, b) => ({
      danceability: a.danceability + b.danceability,
      energy: a.energy + b.energy,
      key: a.key + b.key,
      acousticness: a.acousticness + b.acousticness,
      loudness: a.loudness + b.loudness,
      mode: a.mode + b.mode,
      tempo: a.tempo + b.tempo}));
    Object.keys(sum).map((key) => average[key] = sum[key]/tracks.length);
    return average;
  }

  getAudioInfo = async (value) => {
    const type = this.getContentType(value);
    const id = this.getContentId(value);
    this.setState({error: ''});
    if (type === "track") {
      this.spotifyWebAPI.getTrack(id, (error, res) => {
          if (error) {
            this.setState({error});
              return;
          }
          this.setState({audioInfo: res, type});
        });
      }
    if (type === "artist") {
      this.spotifyWebAPI.getArtist(id, (error, res) => {
        if (error) {
          this.setState({error});
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
    const {audioFeatures, audioInfo, userLoggedIn, type, error} = this.state;
    return ( 
      <Wrapper>
        {error && <Banner variant={Banner.error}>{error}</Banner>}
        {userLoggedIn ? <div>{audioFeatures && type && audioInfo ? 
        <Halo audioFeatures={audioFeatures} audioInfo={audioInfo} type={type}/> : 
        <Form onSubmit={this.onSubmit} />}</div>  : 
              <StyledButtonPrimary href={this.loginLink}>Login with your Spotify Account</StyledButtonPrimary> }
      </Wrapper> );
  };
};