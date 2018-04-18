import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Spinner, CardItem, Container, Header, Right, Button, Content, Text, Left, Icon, Title, Switch, Body, Footer, FooterTab, Badge, Item, Grid, Row, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { form, general, navigation, drawer } from '../../assets/styles';
import TText from '../common/TText';
import { connect } from 'react-redux';
import { setEdit, updateUser, updateShop } from '../../redux/actions/index';


class SSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    async getBankData() {
        try {
            let response = await fetch('http://server.reservina.ir/bank_data', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                }
            });
            let json = await response.json();
            return json;
        } catch (error) {
            console.log(error);
        }
    }
    _numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    _renderBadge() {
        if (parseInt(this.props.notification.count) > 0)
            return <Badge success style={{ position: 'absolute', top: 0, right: 0 }}>
                <Text style={{ color: 'white' }}>{this.props.notification.count}</Text>
            </Badge>;

        return false;
    }

    _renderMoneyRefresh() {
        if (this.state.loading == true)
            return <Spinner color="gray" size="small" />

        return <TouchableOpacity onPress={() => {
                this.setState({
                    loading: true
                })
                this.getBankData()
                    .then((res) => {
                        if (res.result_code == 200) {
                            this.props.updateUser(res.data)
                        }
                        this.setState({
                            loading: false
                        })
                    })
                    .catch(() => this.setState({ loading: false }))
            }}>
                <Icon name="ios-refresh-outline" color='#333' />
            </TouchableOpacity>
       

    }
    _renderCashPaymentSwith() {
        if (this.props.shop.free_reservation === 1)
            return true

        return false
    }
    async _request( toUrl, method = 'POST') {
        try {
            var request = {
                method,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                },
            };

            let response = await fetch(toUrl, request);
            let json = await response.json();
            return json;
        } catch (error) {
        }
    }
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#DC3023' }} androidStatusBarColor="#8F1D21" iosBarStyle="light-content">

                    <Left style={{ flex: 1 }}>
                        <Icon name="md-menu" onPress={() => Actions.drawerOpen()} style={{ color: 'white', fontWeight: 500 }} />
                    </Left>
                    <Body style={[general.title, { flex: 2 }]}>
                        <Title style={[general.text, { color: 'white' }]}>تنظیمات</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>

                    </Right>
                </Header>
                <Content>
                    <View style={{ backgroundColor: 'rgba(235, 89, 78,1)', height: 55, width: '100%', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
                        <Title style={[general.text, { color: 'white' }]}>اطلاعات مالی</Title>
                    </View>
                    <Grid>
                        <Row style={{ height: 55, backgroundColor: '#f1f1f1' }}>

                            <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Icon active name='md-card' />

                            </Col>
                            <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-start'}}>
                                <TText style={[general.text, { color: 'black' }]}>شماره کارت</TText>
                            </Col>

                            <Col size={3} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TText>{this.props.shop.card_no} </TText>
                            </Col>
                        </Row>
                        <Row style={{ height: 55, backgroundColor: '#f1f1f1' }}>
                            <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Icon active name='md-briefcase' />
                            </Col>
                            <Col size={3} style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                                <TText>
                                    اعتبار حساب {this._numberWithCommas(this.props.user.remaining_money)} تومان
                                    </TText>
                            </Col>
                            <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end', paddingRight:10 }}>
                                {this._renderMoneyRefresh()}
                            </Col>
                        </Row>
                    </Grid>
                    <View style={{ backgroundColor: 'rgba(235, 89, 78,1)', height: 55, width: '100%', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
                        <Title style={[general.text, { color: 'white' }]}>پرداخت</Title>
                    </View>
                    <Grid>
                        <Row style={{ height: 55, backgroundColor: '#f1f1f1' }}>
                            <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Icon active name='md-cash' />

                            </Col>
                            <Col size={3} style={{ justifyContent: 'center', alignItems: 'flex-start'}}>
                                <TText>پرداخت در محل</TText>
                            </Col>

                            <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Switch value={this._renderCashPaymentSwith()} onValueChange={() => {
                                    let newValue = 1-this.props.shop.free_reservation;
                                    this.props.updateShop({ free_reservation: newValue })
                                    var toUrl = `http://server.reservina.ir/shops/update/${this.props.shop.id}?free_reservation=${newValue}`;
                                    console.log(toUrl);
                                    this._request( toUrl)
                                    .then((res) => {
                                        if (res != undefined) {
                                            if (res.result_code == '200') {
                                                this.props.updateShop({ free_reservation: newValue })
                                            } 
                                        }  
                                    })
                                }} />
                            </Col>
                        </Row>
                    </Grid>
                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: '#DC3023' }} androidStatusBarColor="#8F1D21" iosBarStyle="light-content">

                        <Button vertical active style={navigation.active}>
                            <Icon active name="person" style={general.navIcon} />
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
        setEdit: edit => {
            dispatch(setEdit(edit))
        },
        updateUser: user => {
            dispatch(updateUser(user))
        },
        updateShop: shop => {
            dispatch(updateShop(shop))
        },
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        shop: state.shop,
        notification: state.notification
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SSettings)