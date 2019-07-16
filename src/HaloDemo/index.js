import React, { PureComponent } from 'react';
import {Part, Main, View } from './styled';

export default class Halo extends PureComponent {
  state = {
    complexity:1, // energy
    speed:4, // tempo
    saturation:50, // energy
    size:18, // loudness 
    randomness:4, //danceability 
    thickness:2, // acousticness 
    hue:135, // key 
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
    const { complexity, size } = this.state;
    return ( 
   <div>
    <div>
    <View>
    <Main speed={2} size={size}>
      {this.renderDivs(1, complexity)}
    </Main>
    </View>
  </div>
    </div>
  )}
};
