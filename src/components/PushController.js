import React, { Component } from 'react';
import PushNotification from 'react-native-push-notification';
import { Actions } from 'react-native-router-flux';

export default class PushController extends Component {
    componentWillMount() {
        PushNotification.configure({

            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
                console.log( 'TOKEN:', token );
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
                console.log( 'NOTIFICATION:', notification );
                Actions.notifications();
                
            },
        });
    }
    render() {
        return null;
    }
}