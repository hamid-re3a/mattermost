import React from 'react';
import {  Text } from 'react-native';

export default class ShowDay extends React.Component {
    componentWillMount(){
        this.setState({
            day : ''
        });
        if(this.props.children == 0){
            this.setState({
                day : 'َشنبه'
            })
        } else if(this.props.children == 1){
            this.setState({
                day : 'َیکشنبه'
            })
        } else if(this.props.children == 2){
            this.setState({
                day : 'َدوشنبه'
            })
        } else if(this.props.children == 3){
            this.setState({
                day : 'َسه‌شنبه'
            })
        } else if(this.props.children == 4){
            this.setState({
                day : 'چهارشنبه'
            })
        } else if(this.props.children == 5){
            this.setState({
                day : 'َپنجشنبه'
            })
        } else if(this.props.children == 6){
            this.setState({
                day : 'َجمعه'
            })
        } else if(this.props.children == 7){
            this.setState({
                day : 'به جز جمعه'
            })
        } else if(this.props.children == 8){
            this.setState({
                day : 'َبه جز پنجشنبه و جمعه'
            })
        }
    }


    
    render() {
        return (
            <Text>
                 {this.state.day} 
            </Text>
            
        )
    }
}