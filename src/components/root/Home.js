import React from 'react';
import { ImageBackground, View, TouchableOpacity, AppState, Dimensions } from "react-native";
import { Badge, Thumbnail, Grid, Col, Container, Header, Body, Button, Content, Text, Left, Right, Icon, Footer, FooterTab, Title, H1, H3, Card, CardItem } from 'native-base';
import { form, general, navigation, drawer } from '../../assets/styles';
import { Actions } from 'react-native-router-flux';
import { setShop, setPersonnel, setEdit, updateUser, setNotification, updateNotification, updateNotificationCount } from '../../redux/actions/index';
import { connect } from 'react-redux';
import PushController from "../../components/PushController";
import PushNotification from 'react-native-push-notification';
import BackgroundTimer from 'react-native-background-timer';


class Home extends React.Component {

    componentWillMount() {
        this.setState({
            editMode: false,
        });

        this._getShopInfo().then((json) => {
            if(json.result_code == '200')
                this.props.setShop(json.data)
        });
        this._getUserInfo().then((user) => {
            this.props.updateUser(user)
        });
        this._getNotification().then((data) => {
            if(data != undefined && data.data != undefined){
                let notification = { notifications: data.data };
                this.props.setNotification(notification);
            }            
        });

        BackgroundTimer.stopBackgroundTimer();
        BackgroundTimer.runBackgroundTimer(() => {
            this._getNotification().then((data) => {
                if(data != undefined && data.data != undefined){
                    let notification = { notifications: data.data };
                    this.props.updateNotification(notification);
                }
            });
            let that = this;
            let flag = true;

            let countNotification = 0;
            let notifications = this.props.notification.notifications.map(function (notif) {
                if (notif.seen === 0)
                    countNotification++;
                if (notif.seen === 0 && notif.sent !== 1 && flag === true) {
                    //&& AppState.currentState == 'background'
                    flag = false;
                    if(that.props.user.notifications)
                    PushNotification.localNotification({
                        // date: new Date(Date.now() + (5 * 1000)), // in 60 secs
                        id: notif.id,
                        autoCancel: true,
                        largeIcon: "ic_launcher",
                        smallIcon: "ic_notification",
                        // bigText: notif.message,
                        // subText: notif.message,
                        color: "green",
                        vibrate: true,
                        vibration: 300,
                        title: notif.message,
                        message: notif.message,
                        playSound: true,
                        soundName: 'default',
                        // number: 23,
                        // actions: '["Accept", "Reject"]',
                    });
                }
                if (notif.seen === 0 && notif.sent !== 1) {
                    return Object.assign(notif, { sent: 1 });
                }
                return notif;
            });
            let notification = { notifications };
            that.props.updateNotification(notification)
            that.props.updateNotificationCount(countNotification)

        }, 60000);
    }


    async _getShopInfo() {
        try {
            let response = await fetch('http://server.reservina.ir/shops/17434', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            let json = await response.json();
            return json;
        } catch (error) {
            console.log(error);
        }
    }

    async _getUserInfo() {
        try {
            let response = await fetch('http://server.reservina.ir/users', {
                method: 'GET',
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

    async _getNotification() {
        try {
            let response = await fetch('http://server.reservina.ir/notification', {
                method: 'GET',
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

    _renderImage(image) {
        if (image == null || image == '' || image == undefined)
            return <Thumbnail large source={require('../../assets/images/no_pic.png')} />;
        else
            return <Thumbnail large source={{ uri: 'http://server.reservina.ir' + image }} />;
    }
    _showPersonnel() {

        if (this.props.shop.personnel != null && this.props.shop.personnel.length > 0) {
            return this.props.shop.personnel.map(function (person) {
                let item = [];
                if (this.state.editMode == true)
                    item.push(<TouchableOpacity key={1} style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,

                    }}
                        onPress={() => {
                            this.props.setEdit({
                                elementType: 'shop',
                                elementToEdit: 'shopDeletePersonnel',
                                elementId: person.personnel_id,
                                belongsTo: this.props.shop.id,
                            })
                            Actions.editLightbox();
                        }}

                    >

                        <Icon name='md-close-circle' style={{ color: 'rgba(235, 89, 78,1)' }} />
                    </TouchableOpacity>)
                return <Col key={person.id} style={{ height: 120 }}>

                    <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,.4)', justifyContent: 'flex-end', alignItems: 'center' }} >
                        <TouchableOpacity
                            onPress={() => {
                                this.props.setPersonnel(person)
                                Actions.personnel()
                            }
                            }
                        >
                            {this._renderImage(person.profile_pic)}
                        </TouchableOpacity>
                        {item}
                        <TouchableOpacity
                            onPress={() => {
                                this.props.setPersonnel(person)
                                Actions.personnel()
                            }
                            }
                        >
                            <Text style={[general.text, { color: '#333' }]}>{person.first_name}</Text>
                        </TouchableOpacity>
                    </View>
                </Col>
            }.bind(this));
        }

        return <Title style={[general.text, { color: 'black' }]}>هیچ پرسنلی یافت نشد</Title>;
    }
    _renderEditbutton() {
        if (this.props.user.id == this.props.shop.user_id && this.state.editMode == false)
            return <Button transparent onPress={() => this.setState({
                editMode: true
            })}>
                <Icon name="md-create" style={{ color: '#fff' }} />
            </Button>
        if (this.props.user.id == this.props.shop.user_id && this.state.editMode == true)
            return <Button transparent onPress={() => this.setState({
                editMode: false
            })}>
                <Icon name="md-close" style={{ color: '#fff' }} />
            </Button>
        return false;
    }

    _changeBackgroundButton() {

        if (this.state.editMode)
            return <Button transparent onPress={() => {
                this.props.setEdit({
                    elementType: 'shop',
                    elementToEdit: 'BackgroundImage',
                    belongsTo: this.props.shop.id,
                })
                Actions.editLightbox();
            }}
            >
                <Icon name="ios-create-outline" style={{ color: '#fff' }} />
            </Button>

        return false;
    }

    _changeShopAlias() {
        if (this.state.editMode)
            return <TouchableOpacity transparent onPress={() => {
                this.props.setEdit({
                    elementType: 'shop',
                    elementToEdit: 'shopAlias',
                    belongsTo: this.props.shop.id,
                })
                Actions.editLightbox();
            }}
            >
                <H1 style={[general.text, general.h1]}>{this.props.shop.alias}</H1>
            </TouchableOpacity>

        return <H1 style={[general.text, general.h1]}>{this.props.shop.alias}</H1>;
    }

    _changeShopAddress() {
        if (this.state.editMode)
            return <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity transparent onPress={() => {
                    this.props.setEdit({
                        elementType: 'shop',
                        elementToEdit: 'shopAddress',
                        belongsTo: this.props.shop.id,
                    })
                    Actions.editLightbox();
                }}
                >
                    <Text style={[general.text, { color: '#333', fontSize: 15 }]}>آدرس</Text>
                </TouchableOpacity>

                <TouchableOpacity transparent onPress={() => {
                    this.props.setEdit({
                        elementType: 'shop',
                        elementToEdit: 'shopAddress',
                        belongsTo: this.props.shop.id,
                    })
                    Actions.editLightbox();
                }}
                >
                    <Text style={[general.text, { textAlign: 'center', color: '#333', fontSize: 12 }]}>
                        {this.props.shop.work_address}
                    </Text>
                </TouchableOpacity>
            </View>

        return <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[general.text, { color: '#333', fontSize: 15 }]}>آدرس</Text>
            <Text style={[general.text, { textAlign: 'center', color: '#333', fontSize: 12 }]}> {this.props.shop.work_address} </Text>
        </View>;
    }
    _changeShopPhone() {
        if (this.state.editMode)
            return <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity transparent onPress={() => {
                    this.props.setEdit({
                        elementType: 'shop',
                        elementToEdit: 'shopPhone',
                        belongsTo: this.props.shop.id,
                    })
                    Actions.editLightbox();
                }}
                >
                    <Text style={[general.text, { color: '#333', fontSize: 15 }]}>شماره تماس</Text>
                </TouchableOpacity>
                <TouchableOpacity transparent onPress={() => {
                    this.props.setEdit({
                        elementType: 'shop',
                        elementToEdit: 'shopPhone',
                        belongsTo: this.props.shop.id,
                    })
                    Actions.editLightbox();
                }}
                >
                    <Text style={[general.text, { textAlign: 'center', color: '#333', fontSize: 12 }]}>
                        {this.props.shop.work_phone}
                    </Text>
                </TouchableOpacity>
            </View>

        return <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[general.text, { color: '#333', fontSize: 15 }]}>شماره تماس</Text>
            <Text style={[general.text, { textAlign: 'center', color: '#333', fontSize: 12 }]}> {this.props.shop.work_phone} </Text>
        </View>;
    }

    _renderAddPersonnel() {
        if (this.state.editMode)
            return <Col style={{ height: 120 }}>

                <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,.4)', justifyContent: 'center', alignItems: 'center' }} >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.setEdit({
                                elementType: 'shop',
                                elementToEdit: 'shopAddPersonnel',
                                belongsTo: this.props.shop.id,
                            })
                            Actions.editLightbox();
                        }}

                    >

                        <Thumbnail large source={require('../../assets/images/no_pic.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        position: 'absolute',
                        top: 15,
                        right: 15,

                    }}
                        onPress={() => {
                            this.props.setEdit({
                                elementType: 'shop',
                                elementToEdit: 'shopAddPersonnel',
                                belongsTo: this.props.shop.id,
                            })
                            Actions.editLightbox();
                        }}

                    >

                        <Icon name='md-add-circle' style={{ color: 'rgba(235, 89, 78,1)' }} />
                    </TouchableOpacity>

                </View>
            </Col>


        return false;
    }

    _renderBadge(){
        if(parseInt(this.props.notification.count) > 0)
            return <Badge success style={{position:'absolute',top:0,right:0 }}>
            <Text style={{color:'white'}}>{this.props.notification.count}</Text>
        </Badge>;
        
        return false;
    }

    render() {
        var {height, width} = Dimensions.get('window');
        return (
            <Container>
                <PushController />
                <Header style={{ backgroundColor: '#DC3023' }} androidStatusBarColor="#8F1D21" iosBarStyle="light-content">

                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => Actions.drawerOpen()}>
                            <Icon name="md-menu" style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[general.title, { flex: 2 }]}>
                        <Title style={[general.text, { color: 'white' }]}>{this.props.shop.alias}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        {this._renderEditbutton()}
                    </Right>
                </Header>
                <Content style={{ backgroundColor: 'white' }}>
                    <ImageBackground source={require('../../assets/images/sample_beauty_shop.jpg')} style={[drawer.imageHeader,{height:height/3}]} >
                        <ImageBackground source={{ uri: 'http://server.reservina.ir' + this.props.shop.uuid }} style={[drawer.imageHeader,{height:height/3}]} >
                            {this._changeBackgroundButton()}
                            <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,.4)', justifyContent: 'center', alignItems: 'center' }}>

                                {this._changeShopAlias()}
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="md-star" style={{ color: '#FFA400' }} />
                                    <Icon name="md-star" style={{ color: '#FFA400' }} />
                                    <Icon name="md-star" style={{ color: '#FFA400' }} />
                                    <Icon name="md-star" style={{ color: '#FFA400' }} />
                                    <Icon name="md-star" style={{ color: '#FFA400' }} />
                                </View>
                            </View>
                        </ImageBackground>
                    </ImageBackground>
                    <Title style={[general.text, { color: 'black' }]}>رزرو نوبت</Title>
                    <View style={{
                        backgroundColor: 'white',
                        flexDirection: 'row', justifyContent: 'center', borderBottomColor: '#F2F1EF', borderBottomWidth: 1,
                        borderTopColor: '#F2F1EF', borderTopWidth: 1,
                    }}>


                        <Grid style={{
                            height: height/3,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {this._showPersonnel()}
                            {this._renderAddPersonnel()}

                        </Grid>
                    </View>
                    <ImageBackground source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${this.props.shop.latitude},${this.props.shop.longitude}&zoom=17&scale=1&size=600x200&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C${this.props.shop.latitude},${this.props.shop.longitude}` }} style={{
                        height: height/3,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} >
                        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,.6)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', padding: 15 }}>


                            {this._changeShopAddress()}
                            {this._changeShopPhone()}

                        </View>
                    </ImageBackground>
                    

                </Content>
                <Footer >
                    <FooterTab style={{ backgroundColor: '#DC3023' }} androidStatusBarColor="#8F1D21" iosBarStyle="light-content">

                        <Button vertical onPress={() => Actions.profile()}>
                            <Icon name="person" style={general.navIcon} />
                            <Text style={general.navText}>پروفایل</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.notifications()}>
                            <Icon name="md-notifications" style={general.navIcon} />
                            {this._renderBadge()}
                            <Text style={general.navText}>اعلان‌ها</Text>
                        </Button>
                        <Button vertical active style={navigation.active} onPress={() => Actions.reset('root')}>
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
        setShop: user => {
            dispatch(setShop(user))
        },
        setPersonnel: personnel => {
            dispatch(setPersonnel(personnel))
        },
        setEdit: edit => {
            dispatch(setEdit(edit))
        },
        updateUser: user => {
            dispatch(updateUser(user))
        },
        setNotification: notification => {
            dispatch(setNotification(notification))
        },
        updateNotification: notif => {
            dispatch(updateNotification(notif))
        },
        updateNotificationCount: count => {
            dispatch(updateNotificationCount(count))
        }
    }
}
const mapStateToProps = (state) => {
    return {
        shop: state.shop,
        user: state.user,
        notification: state.notification
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)