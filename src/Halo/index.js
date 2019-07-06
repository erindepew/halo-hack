import React, { PureComponent } from 'react';
import {Part, Main, View} from './styled';

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
      speed: Math.round(tempo / 20),
      size: Math.round(loudness + 30),
      thickness: Math.round(acousticness * 5),
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
    return ( 
    <div>
    <View>
<Main speed={2} size={size}>
      {this.renderDivs(1, complexity)}
</Main>
</View>
    </div>
  )}
};
