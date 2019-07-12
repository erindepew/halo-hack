import styled, {keyframes} from 'styled-components';
import {white} from '@spotify-internal/tokens/creator/web/tokens.common';
import {Type, Image} from '@spotify-internal/creator-tape'

const rotate = keyframes`
from {
  transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg)
}
to{
  transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg)}`;

const zRotateView = keyframes`
from {
  transform: rotateX(60deg) rotateZ(0deg)}
to {
  transform: rotateX(60deg) rotateZ(360deg)}`;

const zRotate = keyframes`
from {
  transform: rotateZ(0deg)
}
to {
  transform: rotateZ(360deg)}`;



export const View = styled.div`
  perspective: 800;
`;

export const Main = styled.div`
position: absolute;
transform-style: preserve-3d;
top: 0;
bottom: 0;
right: 0;
left: 0;
width: ${props => props.size}em;
height: ${props => props.size}em;
margin: 50px auto;
transform: rotateX(60deg) rotateZ(90deg);
animation: ${zRotateView} ${props => props.speed}s linear infinite;
  `;
  
export const Part = styled.div`
transform-style: preserve-3d;
position: absolute;
width: ${props => props.size}%;
height: ${props => props.size}%;
transform: rotateX(3deg) rotateY(3deg) rotateZ(3deg);
animation: ${rotate} ${props => props.speed}s linear infinite;

&::after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 50%;
    border-left: ${props => props.thickness} solid hsla(${props => props.highlight}, 1);
    animation: ${zRotate} 1s linear infinite;
    ${props => `box-shadow: -1px 0 hsla(${props.highlight}, 1), -4px 0 8px hsla(${props.mainColor},1), inset 4px 0 8px hsla(${props.shadow}, 0.7);`}
}`

export const Header = styled.div`
  margin: 20px;
`

export const AlbumTitle = styled(Type.p)`
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
`

export const TrackLink = styled.a`
  text-decoration: none;
`
export const TrackTitle = styled(Type.p)`
font-family: Arial, Helvetica, sans-serif;   
margin: 0 0 8px;
border-bottom: 1px solid ${white};
`
export const StyledImage = styled(Image)`
float: left;
height: 64px;
width: 64px;
`
export const Metadata = styled.div`
  float: left;
  text-align: left;
  margin-left: 20px;
`
  