import React from 'react';
import {  Text } from 'react-native';
import {  general } from '../../assets/styles';

export default class TText extends React.Component {
        
    render() {
        return (
            <Text style={[general.text , { color: '#333' } , this.props.style]}>
                {this.props.children}
            </Text>
            
        )
    }
}