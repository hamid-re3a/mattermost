import React from 'react';
import { ImageBackground, View, TouchableOpacity, AppState, Dimensions } from "react-native";
import { Badge, Thumbnail, Grid, Col, Container, Header, Body, Button, Content, Text, Left, Right, Icon, Footer, FooterTab, Title, H1, H3, Card, CardItem } from 'native-base';
import { form, general, navigation, drawer } from '../../assets/styles';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import PushController from "../../components/PushController";
import PushNotification from 'react-native-push-notification';
import BackgroundTimer from 'react-native-background-timer';


class Home extends React.Component {

    render() {
        var {height, width} = Dimensions.get('window');
        return (
            <Container>
            </Container>
        )
    }

}


export default connect(null, null)(Home)