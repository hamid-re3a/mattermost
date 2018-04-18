import React from 'react';
import { StatusBar, AsyncStorage , NetInfo } from 'react-native';
import { Container, Spinner, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from './../assets/styles';
import { connect } from "react-redux";

class Splash extends React.Component {
    componentWillMount() {
        this.setState({
            isConnected : false
        })

        this.check_network.bind(this);
        
    }
    check_network(){
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
               this.setState({
                   isConnected : true
               })
            } else {
                Actions.internet();
            }
        }).catch(() => {
            Actions.internet();
        });
    }
    render() {
        const style = styles.index;
        if ( this.state.isConnected === true && this.props.rehydrated === true) {
           
            this.CheckUserLogin().then(status => {
                if (status) {
                    Actions.reset('root');
                } else {
                    Actions.reset('auth');
                }

            });

        } else {
            this.check_network()
        }

        return (
            <Container style={style.splashContainer}>
                <StatusBar backgroundColor="#8F1D21" barStyle="light-content" />
                <Text style={style.splashText}>محل کار شما</Text>
                <Spinner color='#BFBFBF' />
            </Container>
        )
    }
    async CheckUserLogin() {
        try {
            let apiToken = this.props.user.apiToken;
            return apiToken === null
                ? false
                : await this.CheckUserLoginFromApi(apiToken);
        } catch (error) {
            console.log(error)
        }
    }

    async CheckUserLoginFromApi(apiToken) {
        try {
            let response = await fetch('http://server.reservina.ir/users', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`
                }
            });
            return response.status === 200;
        } catch (error) {
            console.log(error);
        }
    }

}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        rehydrated: state.rehydrated
    }
}
export default connect(mapStateToProps, null)(Splash);