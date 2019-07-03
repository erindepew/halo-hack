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
    const audioFeatures = this.props.audioFeatures;
    // const colors = [['255, 255, 255', '180, 155, 200', '255, 200, 100'], ['255, 70, 50', '245, 155, 35', '240, 55, 165'], ['80, 155, 245', '160, 195, 210', '155, 240, 225' ], ['255, 255, 255', '180, 155, 200', '255, 200, 100'], ['255, 70, 50', '245, 155, 35', '240, 55, 165'], ['80, 155, 245', '160, 195, 210', '155, 240, 225' ], ['255, 255, 255', '180, 155, 200', '255, 200, 100'], ['255, 70, 50', '245, 155, 35', '240, 55, 165'], ['80, 155, 245', '160, 195, 210', '155, 240, 225' ]];
    let hue; 
    if (audioFeatures.valence > 0.5) {
      const degrees = (audioFeatures.key * 15);
      if (degrees >= 90) {
        hue = 360 - (degrees - 90); 
      }
      else {
        hue = 90 - degrees; 
      }
    }
    else {
      hue = 270 - (audioFeatures.key * 15);
    }
    this.setState({
      randomness: Math.round(10 * audioFeatures.danceability),
      complexity: Math.round(10 * audioFeatures.energy),
      speed: Math.round(audioFeatures.tempo / 20),
      size: Math.round(audioFeatures.loudness + 30),
      thickness: Math.round(audioFeatures.acousticness * 5),
      saturation: Math.round(audioFeatures.energy * 10) * 10,
      hue: audioFeatures.key * 15
    })
  }

  // 90 - 0 - 270 major keys 
  // 91 - 269 minor keys 
  // each key is 15 degrees on the circle 

  renderDivs = (n, complexity) => {
    const {hue, saturation, speed, randomness, thickness} = this.state;
    const highlight = `${hue}, ${saturation}%, 50%`;
    const mainColor = `${hue}, ${saturation}%, 50%`;
    const shadow = `${hue}, ${saturation}%, 50%`;

    if (complexity > 0 ) {
      for (let i = 0; i < n; i++) {
        return (
          <Part className="part" key={complexity} speed={speed} color1={highlight} color2={mainColor} color3={shadow} size={100 - randomness}  thickness={thickness}>
          {this.renderDivs(n, complexity - 1)}
        </Part>
        )
      }
    }
    else { return (<Part className="part" key={complexity} speed={speed} color1={highlight} color2={mainColor} color3={shadow} size={100 - randomness} thickness={thickness}></Part>) }
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
