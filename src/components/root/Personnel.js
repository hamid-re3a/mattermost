import React from 'react';
import { ImageBackground, View } from "react-native";
import { Badge, Spinner, Thumbnail, Grid, Row, Col, Container, Header, Body, Button, Content, Text, Left, Right, Icon, Footer, FooterTab, Title, H1, H3, Card, CardItem } from 'native-base';
import { form, general, navigation, drawer, personnel } from '../../assets/styles';
import { Actions } from 'react-native-router-flux';
import { setPersonnelServices , setReserveInfo } from '../../redux/actions/index';
import { connect } from 'react-redux';

class Personnel extends React.Component {
    componentWillMount() {

        this.setState({
            reserve_step: 0,
            reserve_info: {
                service_id: null,
                start_time: null,
                date: null,
                free_days: null,
                free_hours: null,
                show_date: null,
                service_name: null,
                service_price: null,
                length_time: null
            }
        })
        if (this.props.personnel != null)
            this._getPersonnelServices(this.props.personnel.personnel_id).then((personnel) => {
                this.props.setPersonnelServices(personnel.services)
            });

    }
    async _getPersonnelServices(personnel_id) {
        try {
            let response = await fetch(`http://server.reservina.ir/shop_personnel/${personnel_id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            let json = await response.json();
            if(json.data.length == 0)
                Actions.pop();
            return json.data;
        } catch (error) {
            Actions.pop();
        }
    }

    async _getPersonnelFreeDays(personnel_id, length_time) {
        try {
            let response = await fetch(`http://server.reservina.ir/personnel_free_days?personnel_id=${personnel_id}&time_length=${length_time}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            let json = await response.json();
            if(json.data.length == 0)
                Actions.pop();
            return json.data;
        } catch (error) {
            Actions.pop();
        }
    }

    async _getPersonnelFreeHours(personnel_id, length_time, date) {
        try {
            let response = await fetch(`http://server.reservina.ir/personnel_free_hours?personnel_id=${personnel_id}&time_length=${length_time}&date=${date}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            let json = await response.json();
            if(json.data.length == 0)
                Actions.pop();
            return json.data;
        } catch (error) {
            Actions.pop();
        }
    }

    _renderImage(image) {
        if (image == null || image == '' || image == undefined)
            return <Thumbnail large source={require('../../assets/images/no_pic.png')} />;
        else
            return <Thumbnail large source={{ uri: 'http://server.reservina.ir' + image }} />;
    }

    _renderUserImage(image) {
        if (image == null || image == '' || image == undefined)
            return <Thumbnail large source={require('../../assets/images/no_pic.png')} />;
        else
            return <Thumbnail large source={{ uri: 'http://server.reservina.ir' + image }} />;
    }
    _showPersonnel() {

        if (this.props.personnel != null) {
            return <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,.4)', justifyContent: 'flex-end', alignItems: 'center' }} >
                {this._renderImage(this.props.personnel.profile_pic)}
                <Text style={[general.text, { color: '#333' }]}>{this.props.personnel.first_name}</Text>

            </View>;
        }

    }
    _showServices() {

        if (this.props.personnel != null && this.props.personnel.services != null && this.props.personnel.services.length > 0) {
            return this.props.personnel.services.map(function (service) {
                return <Row key={service.service_id} style={{ height: 40 }}>
                    <Button full bordered rounded danger
                        onPress={() => {
                            this.setState({

                                reserve_step: 1,
                                reserve_info: {
                                    ...this.state.reserve_info,
                                    service_id: service.service_id,
                                    length_time: service.length_time,
                                    service_name: service.service_name,
                                    service_price: service.service_price,
                                }
                            })

                            this._getPersonnelFreeDays(this.props.personnel.personnel_id, service.length_time).then((res) => {
                                this.setState({

                                    reserve_step: 1,
                                    reserve_info: {
                                        ...this.state.reserve_info,
                                        free_days: res,
                                    }
                                })
                            })
                        }}
                    >
                        <Text style={[general.text, { color: '#333' }]}> {service.service_price} تومان</Text>
                        <Title style={[general.text, { color: 'black' }]}>{service.service_name}  </Title>
                        <Text style={[general.text, { color: '#333' }]}> مدت {service.length_time}</Text>
                    </Button>
                </Row>
            }.bind(this));
        }

        return <Spinner color='#BFBFBF' />;
    }

    _showDays(part) {

        if (this.state.reserve_info.free_days != null && this.state.reserve_info.free_days.length > 0) {
            return this.state.reserve_info.free_days.map(function (day, index) {
                if (index % 2 == part)
                    return false;
                return <Row key={day.date} style={{ height: 40 }}>
                    <Button full bordered rounded danger
                        onPress={() => {
                            this.setState({

                                reserve_step: 2,
                                reserve_info: {
                                    ...this.state.reserve_info,
                                    date: day.date,
                                    show_date: day.show_date,
                                }
                            });
                            this._getPersonnelFreeHours(this.props.personnel.personnel_id, this.state.reserve_info.length_time, day.date).then((res) => {
                                this.setState({

                                    reserve_step: 2,
                                    reserve_info: {
                                        ...this.state.reserve_info,
                                        free_hours: res,
                                    }
                                })
                            })
                        }}
                    >
                        <Text style={[general.text, { color: '#333' }]}> {day.show_date}</Text>
                    </Button>
                </Row>
            }.bind(this));
        }
        if (part % 2 == 1)
            return <Spinner color='#BFBFBF' />;
        return false;

    }
    _showHours(part) {

        if (this.state.reserve_info.free_hours != null && this.state.reserve_info.free_hours.length > 0) {
            return this.state.reserve_info.free_hours.map(function (hours, index) {
                if (index % 3 == part) {
                    return <Row key={hours.hour} style={{ height: 40 }}>
                        <Button full bordered rounded danger onPress={() => {
                            this.setState({

                                reserve_step: 3,
                                reserve_info: {
                                    ...this.state.reserve_info,
                                    start_time: hours.hour
                                }
                            });
                        }}
                        >
                            <Text style={[general.text, { color: '#333' }]}> {hours.hour}</Text>
                        </Button>
                    </Row>
                }
                return false;

            }.bind(this));
        }

        if (part % 3 == 1)
            return <Spinner color='#BFBFBF' />;
        return false;
    }
    _renderStatusContent() {
        if (this.state.reserve_step == 0) {
            return <Grid style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showServices()}</Grid>;
        } else if (this.state.reserve_step == 1) {
            return <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', }}>

                <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showDays(1)}</Col>
                <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showDays(0)}</Col>
            </Grid>;
        } else if (this.state.reserve_step == 2) {
            return <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', }}>
                <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showHours(0)}</Col>
                <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showHours(1)}</Col>
                <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showHours(2)}</Col>
            </Grid>;
        } else if (this.state.reserve_step == 3) {
            return <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', }}><Card style={{}}>
                <CardItem style={{ borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                    <Left>
                        {this._renderImage(this.props.user.profile_pic)}

                        <Body>
                            <Text style={{ marginRight: 20, fontFamily: 'IRANSansMobile', textAlign: 'right' }}> {this.props.user.first_name}  {this.props.user.last_name}</Text>

                        </Body>
                        <View style={{ height: '100%' }}>
                            <Text style={{ marginRight: 20, fontFamily: 'IRANSansMobile', textAlign: 'right' }}>{this.state.reserve_info.service_name}</Text>
                            <Text style={{ textAlign: 'right', fontFamily: 'IRANSansMobile' }} note> {this.state.reserve_info.show_date}</Text>
                        </View>

                    </Left>
                </CardItem>
                <CardItem>
                    <Left>
                        <Text style={{ fontSize: 15, fontFamily: 'IRANSansMobile' }}> {this.state.reserve_info.service_price} تومان</Text>
                        <Text style={{ textAlign: 'right', fontFamily: 'IRANSansMobile' }} note>ساعت شروع -  {this.state.reserve_info.start_time}</Text>
                    </Left>
                    <Right>
                        <Button success onPress={() => {
                            this.props.setReserveInfo(this.state.reserve_info)
                             Actions.paymentLightbox() 
                             }}>
                            <Text style={{ fontFamily: 'IRANSansMobile' }}>تایید</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
            </Grid>;
        }

        return false;
    }

    _renderStatusHeaderText() {
        if (this.state.reserve_step == 0) {
            return 'انتخاب سرویس';
        } else if (this.state.reserve_step == 1) {
            return 'انتخاب روز';
        } else if (this.state.reserve_step == 2) {
            return 'انتخاب ساعت';
        } else if (this.state.reserve_step == 3) {
            return 'تایید رزرو';
        }

        return false;
    }
    _renderStatusMenu(name, number) {
        if (this.state.reserve_step == number) {
            return <Row style={personnel.reserveStatusRow}>

                <Icon name="ios-arrow-dropleft" style={personnel.reserveStatusActiveIcon} />
                <Text style={personnel.reserveStatusActiveText}>  {name}  </Text>
            </Row>
        }

        return <Row style={personnel.reserveStatusRow}>

            <Icon name="ios-arrow-dropleft" style={personnel.reserveStatusIcon} />
            <Text style={personnel.reserveStatusText}>  {name}  </Text>
        </Row>;
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

                    </Left>
                    <Body style={[general.title, { flex: 2 }]}>
                        <Title style={[general.text, { color: 'white' }]}>{this.props.shop.alias}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon name="md-arrow-back" style={{ color: '#fff' }} />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ backgroundColor: 'white' }}>
                    <Button full transparent >
                        <Title style={[general.text, { color: 'black' }]}>رزرو نوبت</Title>
                    </Button>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'center',
                        borderTopColor: '#F2F1EF', borderTopWidth: 1,
                    }}>
                        <Grid>

                            <Col size={1} style={personnel.reserveStatusCol}>

                                {this._renderStatusMenu('سرویس', 0)}
                                {this._renderStatusMenu('روز', 1)}
                            </Col>
                            <Col size={2} style={personnel.reserveStatusMiddleCol}>
                                {this._showPersonnel()}
                            </Col>
                            <Col size={1} style={personnel.reserveStatusCol}>
                                {this._renderStatusMenu('ساعت', 2)}
                                {this._renderStatusMenu('تایید', 3)}
                            </Col>
                        </Grid>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', padding: 20 }}>
                        <Button full transparent >
                            <Title style={[general.text, { color: 'black' }]}>{this._renderStatusHeaderText()}</Title>
                        </Button>

                        {this._renderStatusContent()}
                    </View>

                </Content>
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
                        <Button vertical active style={navigation.active}>
                            <Icon active name="md-home" style={general.navIcon} />
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
        setPersonnelServices: services => {
            dispatch(setPersonnelServices(services))
        },
        setReserveInfo: reserveInfo => {
            dispatch(setReserveInfo(reserveInfo))
        }
    }
}
const mapStateToProps = (state) => {
    return {
        shop: state.shop,
        user: state.user,
        personnel: state.personnel,
        notification: state.notification
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Personnel)