import React from 'react';
import { StatusBar, AsyncStorage, NetInfo, TouchableOpacity } from 'react-native';
import { Container, Spinner, Text, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from './../assets/styles';
import { connect } from "react-redux";

class Internet extends React.Component {
    componentWillMount() {
        this.setState({
            loading: false
        })
    }
    _renderIcon() {

        if (this.state.loading)
            return <Spinner color='#BFBFBF' />

        return <TouchableOpacity onPress={() => {
            this.setState({
                loading: true
            })
            let that = this;
            setTimeout(function () {
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        that.CheckUserLogin().then(status => {
                            if (status) {
                                Actions.reset('root');
                            } else {
                                Actions.reset('auth');
                            }

                        });
                    } else {
                        that.setState({
                            loading: false
                        })
                    }
                }).catch(() => {
                    that.setState({
                        loading: false
                    })
                });
            }, 3000);

        }}>
            <Icon name="ios-refresh-outline" style={{ marginTop: 20, fontSize: 35, color: 'white' }} />
        </TouchableOpacity>
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
    render() {
        const style = styles.index;
        return (
            <Container style={style.splashContainer}>
                <StatusBar backgroundColor="#8F1D21" barStyle="light-content" />
                <Text style={style.splashText}>اینترنت نیست</Text>
                {this._renderIcon()}
            </Container>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        rehydrated: state.rehydrated
    }
}
export default connect(mapStateToProps, null)(Internet);