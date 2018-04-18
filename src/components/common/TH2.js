import React from 'react';
import { H2 } from 'native-base';
import { general } from '../../assets/styles';

export default class TH2 extends React.Component {

    render() {
        return (
            <H2 style={[general.text, general.h1, { color: '#333' }, this.props.style]}>
                {this.props.children}
            </H2>

        )
    }
}