import React, { Component} from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import {Banner} from '@spotify-internal/creator-tape'
import queryString from 'query-string';
import { Wrapper, StyledButtonPrimary} from './styled';
import Halo from './Halo';
import HaloDemo from './HaloDemo';
import Form from './Form';
import { clientId } from './config';
import * as api from './api';
import SpotifyWebApi from 'spotify-web-api-js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false,
      error: '',
    };
    this.appToken = clientId;
    this.redirectURI = encodeURIComponent(
      `${window.location.protocol }//${ window.location.host }${process.env.PUBLIC_URL}/callback`
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

  onSubmit = (value) => this.props.history.push({pathname: `/render/${value}`});

  setError = (error) => this.setState({error});

  render () {
    const {userLoggedIn, error} = this.state;
    return ( 
      <Wrapper>
        { error && <Banner variant={Banner.error}>{error}</Banner> }
        <Route exact path={`/`} render={() => 
          userLoggedIn ?  <Form onSubmit={this.onSubmit} /> 
          : <StyledButtonPrimary href={this.loginLink}>Login with your Spotify Account</StyledButtonPrimary> } />
        <Route path={`/callback`} render={() => <Redirect to="/"/>} />
        <Route exact path={`/render/static`} render={() => <HaloDemo/>} />
        <Route path={`/render/:uri`} render={() => <Halo spotifyWebAPI={this.spotifyWebAPI} setError={this.setError}/>} />
        <Route path="*" component={() => <div>404 not found</div>}/>
      </Wrapper> );
  };
};

export default withRouter(App);