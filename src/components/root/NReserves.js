import React from 'react';
import { ImageBackground, View, FlatList, TouchableOpacity } from "react-native";
import { Badge, List, ListItem, Thumbnail, Container, Header, Body, Button, Content, Text, Left, Right, Icon, Footer, FooterTab, Title, H1, H3, Card, CardItem, Spinner } from 'native-base';
import { form, general, navigation, drawer } from '../../assets/styles';
import { Actions } from 'react-native-router-flux';
import { setShop, setPersonnel } from '../../redux/actions/index';
import { connect } from 'react-redux';
import moment from 'moment-jalaali';
// import PushController from "../../components/PushController";
// import PushNotification from 'react-native-push-notification';


class NReserves extends React.Component {
    componentWillMount() {
        this.setState({
            reserves: [],
            page: 1,
            loading: false,
            refreshing: false
        }, () => this.getReservesRequest());

    }

    _renderUserImage(image) {
        if (image == null || image == '' || image == undefined)
            return <Thumbnail source={require('../../assets/images/no_pic.png')} />;
        else
            return <Thumbnail source={{ uri: 'http://server.reservina.ir' + image }} />;
    }

    _renderRate(reserve) {
        let rate = reserve.rate;
        if(reserve.is_accepted != 1 || reserve.is_paid != 1)
            return false;
        if (rate == 0 || rate == null) {
            return <CardItem>
                <Right style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'IRANSansMobile' }}> امتیاز این سرویس؟</Text>
                </Right>
                {this._renderRateStars(0, reserve)}
            </CardItem>
        }

        return <CardItem>
            <Right style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontFamily: 'IRANSansMobile' }}> امتیاز داده شده</Text>
            </Right>
            {this._renderRateStars(rate, reserve)}
        </CardItem>;

    }

    _setRate(rate, reserve) {
        var reserves = this.state.reserves.map(function (item) {

            if (item.reserve.id == reserve.id) {
                temp = item;
                temp.reserve.rate = rate;
                return temp;
            }

            return item;
        });

        this.setState({
            reserves
        });
    }

    _renderRateStars(number, reserve) {

        var rows = [];
        if (number == 0) {
            return <Body style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => {
                    this._setRate(5, reserve)
                    this.getRateRequest(5, reserve.id)
                        .then(()=>true)
                        .catch(()=>false)
                }
                }
                >
                    <Icon name="md-star-outline" style={{ color: '#7f8c8d' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this._setRate(4, reserve)
                    this.getRateRequest(4, reserve.id)
                        .then(()=>true)
                        .catch(()=>false)
                }
                }
                >
                    <Icon name="md-star-outline" style={{ color: '#7f8c8d' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this._setRate(3, reserve)
                    this.getRateRequest(3, reserve.id)
                        .then(()=>true)
                        .catch(()=>false)
                }
                }
                >
                    <Icon name="md-star-outline" style={{ color: '#7f8c8d' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this._setRate(2, reserve)
                    this.getRateRequest(2, reserve.id)
                        .then(()=>true)
                        .catch(()=>false)
                }
                }
                >
                    <Icon name="md-star-outline" style={{ color: '#7f8c8d' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this._setRate(1, reserve)
                    this.getRateRequest(1, reserve.id)
                        .then(()=>true)
                        .catch(()=>false)
                }
                }
                >
                    <Icon name="md-star-outline" style={{ color: '#7f8c8d' }} />
                </TouchableOpacity>
            </Body>
        } else {
            for (var i = number; i < 5; i++) {
                rows.push(<Icon key={i} name="md-star-outline" style={{ color: '#7f8c8d' }} />);
            }
        }

        for (var i = 0; i < number; i++) {
            rows.push(<Icon key={i} name="md-star" style={{ color: '#FFA400' }} />);
        }
        return <Body style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>{rows}</Body>;

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
    renderItem({ item }) {
        return <Card style={{}}>
            <CardItem style={{ borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                <Left>
                    {this._renderUserImage(item.personnel_user.profile_pic)}
                    <Body style={{ alignItems: 'center' }}>
                        <Text style={{ marginRight: 20, fontFamily: 'IRANSansMobile' }}>{item.personnel_user.first_name}</Text>
                        <Text style={{ fontFamily: 'IRANSansMobile' }} note>{moment(item.reserve.date, 'YYYY-M-D').format('dddd jM/jD')} - 
                        {item.reserve.start_time.replace(/^(?:0(\d)|(\d\d)):(\d\d):\d\d$/, this.replacer)}</Text>
                    </Body>
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <Text style={{ marginRight: 20, fontFamily: 'IRANSansMobile', textAlign: 'left' }}>{item.service.service_name}</Text>
                    </View>
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <Icon name="ios-cut" style={general.text} />
                    </View>

                </Left>
            </CardItem>
            {this._renderRate(item.reserve)}

        </Card>
    }

    handleRefresh() {
        this.setState({ page: 1, refreshing: true }, () => {
            this.getReservesRequest()
        });
    }


    renderFooter() {
        if (!this.state.loading) return null;

        return <Spinner />
    }

    handleLoadMore() {
        if (this.state.reserves.length >= 5) {
            this.setState({ page: this.state.page + 1, loading: true }, () => {
                this.getReservesRequest()
            })
        }
    }
    async getRateRequest(rate, reserve_id) {
        try {
            const { page } = this.state;
            let response = await fetch(`http://server.reservina.ir/past_reserves_rate?rate=${rate}&reserve_id=${reserve_id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                }
            });
        } catch (error) {
            console.log(error)
        }

        return true;
    }
    async getReservesRequest() {
        try {
            const { page } = this.state;
            let response = await fetch(`http://server.reservina.ir/past_reserves?page=${page}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                }
            });
            let json = await response.json();
            let reserves = json.data;

            if (reserves.length > 0) {
                this.setState(prevState => {
                    return {
                        reserves: page === 1 ? reserves : [...prevState.reserves, ...reserves],
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
                    <Text style={{ fontFamily: 'IRANSansMobile' }}>رزروهای گذشته</Text>
                </CardItem>
                <CardItem>
                    <Body>
                        <Text style={{ fontFamily: 'IRANSansMobile' }}>
                            در این بخش شما میتوانید لیست رزروهایی
                            که انجام داده اید را مشاهد کنید
              </Text>
                    </Body>
                </CardItem>
                <CardItem footer>
                    <Text style={{ fontFamily: 'IRANSansMobile' }}>جهت رفرش این باکس را به پایین بکشید</Text>
                </CardItem>
            </Card>
        </Content>;
    }

    _renderBadge(){
        if(parseInt(this.props.notification.count) > 0)
            return <Badge success style={{position:'absolute',top:0,right:0 }}>
            <Text style={{color:'white'}}>{this.props.notification.count}</Text>
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
                        <Title style={[general.text, { color: 'white' }]}>رزروهای گذشته</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>

                    </Right>
                </Header>
                <FlatList
                    style={{ backgroundColor: 'white' }}
                    data={this.state.reserves}
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
                            <Icon active name="md-home" style={general.navIcon} />
                            <Text style={general.navText}>خانه</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.future_reserve()}>
                            <Icon name="md-book" style={general.navIcon} />
                            <Text style={general.navText}>رزروها</Text>
                        </Button>
                        <Button vertical active style={navigation.active}>
                            <Icon name="md-filing" style={general.navIcon} />
                            <Text style={general.navText}>تاریخچه</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        notification: state.notification
        // rehydrated : state.rehydrated
    }
}

export default connect(mapStateToProps, null)(NReserves)