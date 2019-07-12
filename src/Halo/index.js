import React, { PureComponent } from 'react';
import {Type} from '@spotify-internal/creator-tape'
import {white} from '@spotify-internal/tokens/creator/web/tokens.common';
import {Part, Main, View, Header, SubTitle, Title, TrackLink, StyledImage, Metadata} from './styled';

export default class Halo extends PureComponent {
  state = {
    complexity: 0,
    speed: 0,
    saturation: [],
    size: 0,
    randomness: 0,
    thickness: 0,
    hue: 0,
  }

  componentDidMount() {
    const {danceability, energy, tempo, loudness, acousticness, key} = this.props.audioFeatures;
    this.setState({
      randomness: Math.round(10 * danceability),
      complexity: Math.round(10 * energy),
      speed: Math.round(500 / tempo),
      size: Math.round(loudness + 30),
      thickness: Math.round(acousticness * 20),
      saturation: Math.round(10 * energy) * 10,
      hue: key * 15
    })
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
    const {complexity, size} = this.state;
    const {audioInfo, type} = this.props;
    return ( 
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
    </div>
  )}
};
