import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class CheckLogin extends Component {
    componentWillMount() {
        this.CheckUserLogin().then(status => {
            if(! status) {
                AsyncStorage.removeItem('apiToken');
                Actions.reset('auth');
            }
        });
    }
    render() {
        return null;
    }
    async CheckUserLogin() {
        try {
            let apiToken = await AsyncStorage.getItem('apiToken');
            return apiToken === null
                ? false
                : await this.CheckUserLoginFromApi(apiToken);
        } catch(error) {
            console.log(error)
        }
    }

    async CheckUserLoginFromApi(apiToken) {
        try {
            let response = await fetch(`http://roocket.org/api/user?api_token=${apiToken}`);
            return response.status === 200;
        } catch(error) {
            console.log(error);
        }
    }
}