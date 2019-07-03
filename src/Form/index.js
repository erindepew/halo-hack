import React, { PureComponent } from 'react';
import {StyledButtonSecondary, StyledFormGroup, StyledFormInput} from './styled';
import {FormInput, ButtonSecondary} from '@spotify-internal/creator-tape'

export default class Form extends PureComponent {
    state = {
        uri: null
    }
    onSubmit = () => {
        this.props.onSubmit(this.state.uri);
    }
  render() { 
    return ( 
    <StyledFormGroup>
        <StyledFormInput theme={FormInput.darkTheme} type="text" placeholder="Enter an artist or track URI" onChange={(event) => this.setState({uri: event.target.value })}/>
        <StyledButtonSecondary theme={ButtonSecondary.darkTheme} onClick={() => this.onSubmit()}>Submit</StyledButtonSecondary>
    </StyledFormGroup>
  )}
};