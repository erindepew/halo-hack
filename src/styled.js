import styled, {keyframes} from 'styled-components';

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
    border-left: ${props => props.thickness} solid rgb(${props => props.color1});
    animation: ${zRotate} 1s linear infinite;
    ${props => `box-shadow: -1px 0 rgba(${props.color1}, 0.5), -4px 0 8px rgba(${props.color2},0.5), inset 4px 0 8px rgba(${props.color3}, 0.2);`}
}`
    
