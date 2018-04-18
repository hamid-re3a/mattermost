import React from 'react';
import { ImageBackground, View, TouchableOpacity, FlatList } from "react-native";
import { Badge, List, ListItem, Thumbnail, Container, Header, Body, Button, Content, Text, Left, Right, Icon, Footer, FooterTab, Title, H1, H3, Card, CardItem, Spinner } from 'native-base';
import { form, general, navigation, drawer } from '../../assets/styles';
import { Actions } from 'react-native-router-flux';
import {  setReserve, setEdit } from '../../redux/actions/index';
import { connect } from 'react-redux';
import moment from 'moment-jalaali';

import TText from '../common/TText';
// import PushController from "../../components/PushController";
// import PushNotification from 'react-native-push-notification';


class Reserves extends React.Component {
    componentWillMount() {
        this.setState({
            notifications: [],
            page: 1,
            loading: false,
            refreshing: false
        }, () => this.getNotificationsRequest());

    }

    componentDidUpdate() {
        this.handleRefresh.bind(this);
    }
    _renderUserImage(image) {
        if (image == null || image == '' || image == undefined)
            return <Thumbnail source={require('../../assets/images/no_pic.png')} />;
        else
            return <Thumbnail source={{ uri: 'http://server.reservina.ir' + image }} />;
    }
    renderStatus(is_accepted, is_paid, reserve) {
        if (is_paid == 0 && is_accepted == 0) {
            return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button style={{padding : 10 , marginRight:10,marginLeft: 10 }} onPress={() => {
                    this.props.setReserve(reserve)
                    Actions.latePaymentLightbox()
                }}>
                    <TText style={{ fontFamily: 'IRANSansMobile' ,color: 'white'}}>
                        پرداخت
                    </TText>
                </Button>

            </View>
        }
        if (is_accepted == 0) {
            return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="md-clock" style={[general.text, { marginRight: 3 }]} />
                <TText>
                    منتظر پاسخ
                </TText>
                <Button danger style={{padding : 10 , marginRight:10,marginLeft: 10 }} onPress={()=>{
                    this.props.setEdit({
                        elementType: 'reserve',
                        elementToEdit: 'cancelReserve',
                        elementId: reserve.id,
                        belongsTo: this.props.user.id,
                    })
                    Actions.editLightbox();
                }}>
                    <TText style={{ fontFamily: 'IRANSansMobile' ,color: 'white'}}>کنسل کن</TText>
                </Button>
            </View>
        } else if (is_accepted == 3) {
            return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="ios-close-circle-outline" style={[general.text, { marginRight: 3 }]} />
                <TText>
                    رد شد
                </TText>
            </View>
        } else if (is_accepted ==5) {
            return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="ios-close-circle-outline" style={[general.text, { marginRight: 3 }]} />
            <TText>
                کنسل شد
            </TText>
        </View>
        }

        return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button danger style={{padding : 10 , marginRight:10,marginLeft: 10 }} onPress={()=>{
            this.props.setEdit({
                elementType: 'reserve',
                elementToEdit: 'cancelReserve',
                elementId: reserve.id,
                belongsTo: this.props.user.id,
            })
            Actions.editLightbox();
        }}>
            <TText style={{ fontFamily: 'IRANSansMobile' ,color: 'white'}}>کنسل کن</TText>
        </Button>
    </View>;
    }
    replacer(match, p1, p2, p3, offset, string) {
        if (p1 == undefined)
            p1 = '';
        if (p2 == undefined)
            p2 = '';
        if (p3 == undefined)
            p3 = '';
        return ` ${p1}${p2}:${p3}`;
    }
    _renderReserveType(type, is_paid){
        if(is_paid == 1){
            if(type == 1)
                return 'بیانه'
            if(type == 2)
                return 'کامل'
            if(type == 0)
                return 'نقدی'
        }
        return 'پرداخت نشده'
    }
    _numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    renderItem({ item }) {
        return <Card style={{}}>
            <CardItem style={{ borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                <Left>
                    {this._renderUserImage(item.personnel_user.profile_pic)}
                    <Body style={{ alignItems: 'center' }}>
                        <TText style={{ marginRight: 20, fontFamily: 'IRANSansMobile' }}>{item.personnel_user.first_name}</TText>
                        <TText style={{ fontFamily: 'IRANSansMobile' }} note>{moment(item.reserve.date, 'YYYY-M-D').format('dddd jM/jD')} -
                         {item.reserve.start_time.replace(/^(?:0(\d)|(\d\d)):(\d\d):\d\d$/, this.replacer)}</TText>
                    </Body>
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <TText style={{ marginRight: 20, fontFamily: 'IRANSansMobile', textAlign: 'left' }}>{item.service.service_name}</TText>
                    </View>
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <Icon name="ios-cut" style={general.text} />
                    </View>

                </Left>
            </CardItem>
            <CardItem>
                <Left style={{ alignItems: 'center' }}>
                    {this.renderStatus(item.reserve.is_accepted, item.reserve.is_paid, item.reserve)}
                </Left>
                <Right style={{ alignItems: 'center' }}>
                    <TText style={{ fontSize: 15, fontFamily: 'IRANSansMobile' }}> {this._numberWithCommas(item.reserve.service_price)} تومان - ({this._renderReserveType(item.reserve.payment_type, item.reserve.is_paid)})</TText>
                </Right>

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
        if (this.state.notifications.length >= 5) {
            this.setState({ page: this.state.page + 1, loading: true }, () => {
                this.getNotificationsRequest()
            })
        }
    }

    async getNotificationsRequest() {
        try {
            const { page } = this.state;
            let response = await fetch(`http://server.reservina.ir/future_reserves?page=${page}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                }
            });
            let json = await response.json();
            let notifications = json.data;

            if (notifications.length > 0) {
                this.setState(prevState => {
                    return {
                        notifications: page === 1 ? notifications : [...prevState.notifications, ...notifications],
                        refreshing: false
                    }
                })
            }
            this.setState({ loading: false })
        } catch (error) {
            console.log(error)
        }
    }
    renderEmptyList() {
        return <Content>
            <Card>
                <CardItem header>
                    <TText style={{ fontFamily: 'IRANSansMobile' }}>روزهای پیش رو</TText>
                </CardItem>
                <CardItem>
                    <Body>
                        <TText style={{ fontFamily: 'IRANSansMobile' }}>
                            در این بخش شما میتوانید لیست رزروهایی
                            که انجام داده اید را مشاهد کنید
                        </TText>
                    </Body>
                </CardItem>
                <CardItem footer>
                    <TText style={{ fontFamily: 'IRANSansMobile' }}>جهت رفرش این باکس را به پایین بکشید</TText>
                </CardItem>
            </Card>
        </Content>;
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
                        <Title style={[general.text, { color: 'white' }]}>رزروهای پیش‌رو</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>

                    </Right>
                </Header>
                <FlatList
                    style={{ backgroundColor: 'white' }}
                    data={this.state.notifications}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item) => item.reserve.id}
                    ListEmptyComponent={this.renderEmptyList}
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
                        <Button vertical onPress={() => Actions.notifications()}>
                            {this._renderBadge()}
                            <Icon name="md-notifications" style={general.navIcon} />
                            <Text style={general.navText}>اعلان‌ها</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.reset('root')}>
                            <Icon name="md-home" style={general.navIcon} />
                            <Text style={general.navText}>خانه</Text>
                        </Button>
                        <Button vertical active style={navigation.active}>
                            <Icon active name="md-book" style={general.navIcon} />
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
        setEdit: edit => {
            dispatch(setEdit(edit))
        },
        setReserve: reserve => {
            dispatch(setReserve(reserve))
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        notification: state.notification
        // rehydrated : state.rehydrated
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reserves)