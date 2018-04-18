import React from 'react';
import { ImageBackground, View, FlatList, TouchableOpacity } from "react-native";
import { Badge, List, ListItem, Thumbnail, Container, Header, Body, Button, Content, Text, Left, Right, Icon, Footer, FooterTab, Title, H1, H3, Card, CardItem, Spinner } from 'native-base';
import { form, general, navigation, drawer } from '../../assets/styles';
import { Actions } from 'react-native-router-flux';
import { setShop, setPersonnel , updateNotificationCount } from '../../redux/actions/index';
import { connect } from 'react-redux';

import TText from '../common/TText';
import TH2 from '../common/TH2';
import moment from 'moment-jalaali';
// import PushController from "../../components/PushController";
// import PushNotification from 'react-native-push-notification';


class Notifications extends React.Component {
    componentWillMount() {
        this.setState({
            notifications: [],
            page: 1,
            loading: false,
            refreshing: false
        }, () => {
            let that = this;
            this.getNotificationsRequest()
                .then((notifications) => {
                    if (notifications[0] != null && notifications[0] != undefined)
                        fetch(`http://server.reservina.ir/notification/${notifications[0].id}`, {
                            method: 'DELETE',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.props.user.apiToken}`
                            }
                        })

                        that.props.updateNotificationCount(0)
                })
        });

    }

    _renderUserImage(image) {
        if (image == null || image == '' || image == undefined)
            return <Thumbnail source={require('../../assets/images/no_pic.png')} />;
        else
            return <Thumbnail source={{ uri: 'http://server.reservina.ir' + image }} />;
    }

    async _answerReserve(is_accepted, reserve_id) {
        try {
            let response = await fetch(`http://server.reservina.ir/shop_personnel/update?id=${reserve_id}&response=${is_accepted}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                }
            });
            let json = await response.json();
            return json.data;
        } catch (error) {
            console.log(error);
        }
    }

    _setAnswer(is_accepted, notification) {
        var notifications = this.state.notifications.map(function (item) {

            if (item.id == notification.id) {
                temp = item;
                temp.response = is_accepted;
                return temp;
            }

            return item;
        });

        this.setState({
            notifications
        });
    }


    renderItem({ item }) {
        if (item.type == 'personnel_request' && item.response == null)
            return <Card style={{}}>
            <CardItem style={{ borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                <Left>
                    
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <Text style={{ marginRight: 20, fontFamily: 'IRANSansMobile', textAlign: 'left' }}></Text>
                    </View>
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <TText note>{moment(item.created_at, 'YYYY-M-D').format('dddd jM/jD ')}</TText>
                    </View>   
                    <Body style={{ alignItems: 'center' }}>
                        <Text style={{ marginRight: 20, fontFamily: 'IRANSansMobile' }}>{item.user.first_name}</Text>
                    </Body>
                    
                </Left>
            </CardItem>
            <CardItem>
                <Body style={{ alignItems:  'flex-start', paddingRight: 20,paddingLeft:20 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'IRANSansMobile' }}> {item.message}</Text>
                </Body>
                <Left style={{ flexDirection:'row' }}>
                        <Button style={{ padding: 20, marginLeft: 20 }} onPress={() => {
                            this._answerReserve(1, item.feedback_id)
                            this._setAnswer(1, item)
                        }}>
                            <TText style={{ color: 'white' }}>
                                قبول
                            </TText>
                        </Button>
                        <Button style={{ padding: 20, marginLeft: 20 }} onPress={() => {
                            this._answerReserve(0, item.feedback_id)
                            this._setAnswer(0, item)
                        }}>
                            <TText style={{ color: 'white' }}>
                                رد
                            </TText>
                        </Button>

                        
                    </Left>
            </CardItem>
        </Card>
            
            
            

        if (item.type == 'reserve_request')
            return <Card style={{}}>
            <CardItem style={{ borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                <TouchableOpacity transparent onPress={() => Actions.reserve()}>
                <Left>
                        
                    
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <Text style={{ marginRight: 20, fontFamily: 'IRANSansMobile', textAlign: 'left' }}></Text>
                    </View>
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <TText note>{moment(item.created_at, 'YYYY-M-D').format('dddd jM/jD ')}</TText>
                    </View>

                </Left>
                </TouchableOpacity>
            </CardItem>
            <CardItem>
                <Body style={{ alignItems: 'flex-start', paddingRight: 20,paddingLeft:20 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'IRANSansMobile' }}> {item.message}</Text>
                </Body>
            </CardItem>
        </Card>
        

        return <Card style={{}}>
            <CardItem style={{ borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                <Left>
                        
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <Text style={{ marginRight: 20, fontFamily: 'IRANSansMobile', textAlign: 'left' }}></Text>
                    </View>
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <TText note>{moment(item.created_at, 'YYYY-M-D').format('dddd jM/jD ')}</TText>
                    </View>
                    <Body style={{ alignItems: 'center' }}>
                        <Text style={{ marginRight: 20, fontFamily: 'IRANSansMobile' }}>{item.user.first_name}</Text>
                    </Body>

                </Left>
            </CardItem>
            <CardItem>
                <Body style={{ alignItems: 'flex-start', paddingRight: 20,paddingLeft:20 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'IRANSansMobile' }}> {item.message}</Text>
                </Body>
            </CardItem>
        </Card>
    }

    handleRefresh() {
        this.setState({ page: 1, refreshing: true }, () => {
            this.getNotificationsRequest()
        });
    }


    renderFooter() {
        if (!this.state.loading) return null;

        return <Spinner />
    }

    handleLoadMore() {
        if (this.state.notifications.length >= 10) {
            this.setState({ page: this.state.page + 1, loading: true }, () => {
                this.getNotificationsRequest()
            })
        }
    }

    async getNotificationsRequest() {
        try {
            const { page } = this.state;
            let response = await fetch(`http://server.reservina.ir/notification?page=${page}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                }
            });
            let json = await response.json();
            let notifications = json.data.data;

            if (notifications.length > 0) {
                this.setState(prevState => {
                    return {
                        notifications: page === 1 ? notifications : [...prevState.notifications, ...notifications],
                        page: json.data.current_page,
                        refreshing: false
                    }
                })
            }
            this.setState({ loading: false })

            return notifications;
        } catch (error) {
            console.log(error)
        }
    }

    _renderBadge() {
        if (parseInt(this.props.notification.count) > 0)
            return <Badge success style={{ position: 'absolute', top: 0, right: 0 }}>
                <Text style={{ color: 'white' }}>{this.props.notification.count}</Text>
            </Badge>;

        return false;
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#DC3023' }} androidStatusBarColor="#8F1D21" iosBarStyle="light-content">

                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => Actions.drawerOpen()}>
                            <Icon name="md-menu" style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[general.title, { flex: 2 }]}>
                        <Title style={[general.text, { color: 'white' }]}>اعلان ها</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>

                    </Right>
                </Header>
                <FlatList
                    style={{ backgroundColor: 'white' }}
                    data={this.state.notifications}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={() => <Spinner />}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.handleLoadMore.bind(this)}
                    onEndReachedThreshold={0.5}
                />
                <Footer >
                    <FooterTab style={{ backgroundColor: '#DC3023' }} androidStatusBarColor="#8F1D21" iosBarStyle="light-content">

                        <Button vertical onPress={() => Actions.profile()}>
                            <Icon name="person" style={general.navIcon} />
                            <Text style={general.navText}>پروفایل</Text>
                        </Button>
                        <Button vertical active style={navigation.active}>
                            {this._renderBadge()}
                            <Icon active name="md-notifications" style={general.navIcon} />
                            <Text style={general.navText}>اعلان‌ها</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.reset('root')}>
                            <Icon name="md-home" style={general.navIcon} />
                            <Text style={general.navText}>خانه</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.future_reserve()}>
                            <Icon name="md-book" style={general.navIcon} />
                            <Text style={general.navText}>رزروها</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.past_reserve()}>
                            <Icon name="md-filing" style={general.navIcon} />
                            <Text style={general.navText}>تاریخچه</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateNotificationCount: count => {
            dispatch(updateNotificationCount(count))
        }
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        notification: state.notification
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)