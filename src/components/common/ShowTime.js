import React from 'react';
import {  Text } from 'react-native';

export default class ShowTime extends React.Component {
    replacer(match, p1, p2, p3, offset, string) {
        if (p1 == undefined)
            p1 = '';
        if (p2 == undefined)
            p2 = '';
        if (p3 == undefined)
            p3 = '';
        return ` ${p1}${p2}:${p3}`;
    }
    
    
    render() {
        return (
            <Text>
                {this.props.children.replace(/^(?:0(\d)|(\d\d)):(\d\d):\d\d$/, this.replacer)}
            </Text>
            
        )
    }
}