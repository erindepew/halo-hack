import React, { PureComponent } from 'react';
import './App.css';
import {Part, Main, View} from './styled';

export default class App extends PureComponent {
  state = {
    complexity: 20,
    speed:[1, 2, 3, 4, 5],
    colors: [['255, 255, 255', '180, 155, 200', '255, 200, 100'], ['255, 70, 50', '245, 155, 35', '240, 55, 165'], ['80, 155, 245', '160, 195, 210', '155, 240, 225' ]],
    size: [1, 2, 3, 4, 5],
    randomness: [5, 10, 15, 20],
    thickness: [1, 2, 3, 4, 5]
  }

  renderDivs = (n, complexity) => {
    const {colors, speed, randomness, thickness} = this.state;
    const colorSet = colors[0];
    if (complexity > 0 ) {
      for (let i = 0; i < n; i++) {
        return (
          <Part className="part" key={complexity} speed={70 / speed[1]} color1={colorSet[0]} color2={colorSet[1]} color3={colorSet[2]} size={100 - randomness[0]}  thickness={thickness[1]}>
          {this.renderDivs(n, complexity - 1)}
        </Part>
        )
      }
    }
    else { return (<Part className="part" key={complexity} speed={70 / speed[0]} color1={colorSet[0]} color2={colorSet[1]} color3={colorSet[2]} size={100 - randomness[0]} thickness={thickness[1]}></Part>) }
    };

  render() { 
    const {complexity, size, speed} = this.state;
    return ( 
    <div className="App">
    <View>
<Main speed={10 / speed[0]} size={15 / size[0]}>
      {this.renderDivs(1, complexity)}
</Main>
</View>
    </div>
  )}
};
