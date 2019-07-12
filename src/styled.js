import styled from 'styled-components';
import {ButtonPrimary} from '@spotify-internal/creator-tape'

export const Wrapper = styled.div`
background-color: black;
position: absolute;
min-height: 100vh;
width: 100%;
top: 0;
right: 0;
left: 0%;
text-align: center;
font-family: Arial, Helvetica, sans-serif; 
`;   

export const StyledButtonPrimary = styled(ButtonPrimary)`
    margin-top: 40px;
    text-decoration: none;
    cursor: pointer;
`;
