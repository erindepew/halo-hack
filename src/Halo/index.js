import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {Type, LoadingIndicator} from '@spotify-internal/creator-tape'
import {white} from '@spotify-internal/tokens/creator/web/tokens.common';
import {Part, Main, View, Header, SubTitle, Title, TrackLink, StyledImage, Metadata} from './styled';

class Halo extends Component {
  state = {
    complexity: 0,
    speed: 0,
    saturation: 0,
    size: 0,
    randomness: 0,
    thickness: 0,
    hue: 0,
    isLoading: true,
    audioInfo: null,
    type: null,
  }

  componentDidMount() {
    this.setValues(window.location.pathname.split('/').pop());
  }

  setValues = async(value) => {
    await this.getAudioFeatures(value);
    await this.getAudioInfo(value);
  }

  getAudioInfo = async (value) => {
    const type = this.getContentType(value);
    const id = this.getContentId(value);
    this.props.setError('');
    if (type === "track") {
      this.props.spotifyWebAPI.getTrack(id, (error, res) => {
          if (error) {
            this.props.setError(error)
              return;
          }
          this.setState({audioInfo: res, type});
        });
      }
    if (type === "artist") {
      this.props.spotifyWebAPI.getArtist(id, (error, res) => {
        if (error) {
          this.props.setError(error)
            return;
        }
        this.setState({audioInfo: res, type});
      });
    }
    }


  getContentId = (value) => {
    const spotifyId = value.split(':')[2];
    return spotifyId;
  }

  getContentType = (value) => {
    const type = value.split(':')[1];
    this.setState({type});
    return type;
  }

  getAudioFeatures = (value) => {
    const type = this.getContentType(value);
    const id = this.getContentId(value);
    this.props.setError('');
    if (type === "track") {
      this.props.spotifyWebAPI.getAudioFeaturesForTrack(id, (error, res) => {
          if (error) {
              this.props.setError(error)
              return;
          }
          const {danceability, energy, tempo, loudness, acousticness, key} = res;
          this.setState({
            randomness: Math.round(10 * danceability),
            complexity: Math.round(10 * energy),
            speed: Math.round(500 / tempo),
            size: Math.round(loudness + 30),
            thickness: Math.round(acousticness * 20),
            saturation: Math.round(10 * energy) * 10,
            hue: key * 15,
          });
      })
    }
    if (type === "artist") {
      this.props.spotifyWebAPI.getArtistTopTracks(id,"US", (error, res) => {
        if (error) {
            this.props.setError(error)
            return;
        }
        this.getAudioFeaturesForTracks(res.tracks);
      });
    }
    else {
      this.props.setError('Not a valid track or artist spotify URI. Must be in "spotify:artist:{id}" or "spotify:track:{id}" format');
    }
  }

  getAudioFeaturesForTracks = (tracks) => {
      const trackUris = tracks.map(track => this.getContentId(track.uri));
      this.props.setError('');
      this.props.spotifyWebAPI.getAudioFeaturesForTracks( trackUris, (error, res) => {
        if (error) {
            this.props.setError(error)
            return;
        }
        const {danceability, energy, tempo, loudness, acousticness, key} = this.averageAudioFeaturesForTracks(res.audio_features);
        this.setState({
          randomness: Math.round(10 * danceability),
          complexity: Math.round(10 * energy),
          speed: Math.round(500 / tempo),
          size: Math.round(loudness + 30),
          thickness: Math.round(acousticness * 20),
          saturation: Math.round(10 * energy) * 10,
          hue: key * 15,
        });
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

  renderDivs = (n, complexity) => {
    const {hue, saturation, speed, randomness, thickness} = this.state;
    const highlight = `${hue}, ${saturation / 2}%, 50%`;
    const mainColor = `${hue}, ${saturation}%, 50%`;
    const shadow = `${hue + 15}, ${saturation}%, 30%`;

    if (complexity > 0 ) {
      for (let i = 0; i < n; i++) {
        return (
          <Part key={complexity} size={100 - randomness} speed={speed} highlight={highlight} mainColor={mainColor} shadow={shadow} thickness={thickness}>
          {this.renderDivs(n, complexity - 1)}
        </Part>
        )
      }
    }
    else { return (<Part key={complexity} size={100 - randomness} speed={speed} highlight={highlight} mainColor={mainColor} shadow={shadow} thickness={thickness}></Part>) }
    };

  render() { 
    const { complexity, size, audioInfo, type } = this.state;
    console.log(JSON.stringify(this.state));
    return ( 
   <div>
     {audioInfo ? 
    <div>
    {type && type === 'track' ? 
      <Header>
      <StyledImage src={audioInfo.album.images[2].url} alt="album image" />
        <Metadata>
        <TrackLink href={audioInfo.external_urls.spotify}><Title variant={Type.body1} color={white}>{audioInfo.name}</Title></TrackLink>
        <SubTitle variant={Type.body3} color={white}>{audioInfo.album.name}</SubTitle>
        <SubTitle variant={Type.body3} color={white}>{audioInfo.album.artists[0].name}</SubTitle> 
        </Metadata>
      </Header>
      : 
      <Header>
      <StyledImage src={audioInfo.images[2].url} alt="arist image" />
        <Metadata>
        <TrackLink href={audioInfo.external_urls.spotify}><Title variant={Type.body1} color={white}>{audioInfo.name}</Title></TrackLink>
        </Metadata>
      </Header>
    }
    <View>
<Main speed={2} size={size}>
      {this.renderDivs(1, complexity)}
</Main>
</View>
  </div> : <LoadingIndicator/> }
    </div>
  )}
};

export default withRouter(Halo);
