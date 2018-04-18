import React from 'react';
import { ImageBackground, View, Dimensions, TouchableOpacity, Keyboard } from "react-native";
import { Badge, Row, Item, Input, Thumbnail, Grid, Col, Container, Header, Body, Button, Content, Text, Left, Right, Icon, Footer, FooterTab, Title, H1, H3, Card, CardItem, Spinner } from 'native-base';
import { form, general, navigation, drawer } from '../../assets/styles';
import TText from '../common/TText';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { setEdit, updateUser } from '../../redux/actions/index';
class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFooter: 'flex',
            first_name: this.props.user.first_name,
            last_name: this.props.user.last_name,
            bio: this.props.user.bio,
            profile_pic: this.props.user.profile_pic,
            loading: false
        }
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidShow() {
        this.setState({ showFooter: 'none' });
    }

    _keyboardDidHide() {
        this.setState({ showFooter: 'flex' });
    }


    changeFirstNameInput(text) {
        this.setState({
            first_name: text
        })
    }

    changeLastNameInput(text) {
        this.setState({
            last_name: text
        })
    }

    changeBioInput(text) {
        this.setState({
            bio: text
        })
    }

    _renderImage(image) {
        if (image == null || image == '' || image == undefined)
            return <Thumbnail large source={require('../../assets/images/no_pic.png')} />;
        else
            return <Thumbnail large source={{ uri: 'http://server.reservina.ir' + image }} />;
    }
    async _updateUser() {
        try {
            let response = await fetch(`http://server.reservina.ir/users/update?first_name=${this.state.first_name}&last_name=${this.state.last_name}&bio=${this.state.bio}`, {
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
    _renderMenu() {
        if (this.props.user.first_name != this.state.first_name || this.props.user.last_name != this.state.last_name || this.props.user.bio != this.state.bio)
            return <Button transparent onPress={() => {
                this._updateUser()
                    .then((json) => {
                        console.log(json);
                        this.props.updateUser(json);
                    })
            }}>
                <Icon name="md-checkmark" style={{ color: '#fff' }} />
            </Button>


        return <Button transparent onPress={() => Actions.drawerOpen()}>
            <Icon name="md-menu" style={{ color: '#fff' }} />
        </Button>
    }

    _renderMenuRight() {
        if (this.props.user.first_name != this.state.first_name || this.props.user.last_name != this.state.last_name || this.props.user.bio != this.state.bio)
            return <Button transparent onPress={() => {
                this.setState({
                    first_name: this.props.user.first_name,
                    last_name: this.props.user.last_name,
                    bio: this.props.user.bio,
                    profile_pic: this.props.user.profile_pic
                });
            }}>
                <Icon name="md-close" style={{ color: '#fff' }} />
            </Button>


        return null
    }

    _renderBadge() {
        if (parseInt(this.props.notification.count) > 0)
            return <Badge success style={{ position: 'absolute', top: 0, right: 0 }}>
                <Text style={{ color: 'white' }}>{this.props.notification.count}</Text>
            </Badge>;

        return false;
    }
    _numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

    _renderMoneyRefresh() {
        if (this.state.loading == true)
            return <Spinner color="gray" size="small" />

        return <View style={{ height: '100%', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => {
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
                <Icon name="ios-refresh-outline" />
            </TouchableOpacity>
        </View>

    }
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#DC3023' }} androidStatusBarColor="#8F1D21" iosBarStyle="light-content">

                    <Left style={{ flex: 1 }}>
                        {this._renderMenu()}

                    </Left>
                    <Body style={[general.title, { flex: 2 }]}>
                        <Title style={[general.text, { color: 'white' }]}>پروفایل</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        {this._renderMenuRight()}
                    </Right>
                </Header>
                <Content style={{ backgroundColor: '#ecf0f1' }}>

                    <View style={{ backgroundColor: 'rgba(235, 89, 78,1)', height: 55, width: '100%', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 50 }}>
                        <Title style={[general.text, { color: 'white' }]}>{this.state.first_name} {this.state.last_name}</Title>
                    </View>
                    <View style={{ height: 55, width: '100%', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 50 }}>


                    </View>
                    <Grid style={{padding: 10}}>
                        <Row>
                            <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[general.text, { color: 'black' }]}>اسم</Text>
                            </Col>
                            <Col size={4}>
                                <Item >
                                    <Icon active name='md-card' />
                                    <Input
                                        style={[general.text, { textAlign: 'right', fontSize: 16, paddingLeft: 12 }]}
                                        placeholder='نام خود را وارد کنید'
                                        value={this.state.first_name}
                                        onChangeText={this.changeFirstNameInput.bind(this)}
                                    />

                                </Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[general.text, { color: 'black' }]}>فامیل</Text>
                            </Col>
                            <Col size={4}>
                                <Item >
                                    <Icon active name='md-card' />
                                    <Input
                                        style={[general.text, { textAlign: 'right', fontSize: 16, paddingLeft: 12 }]}
                                        placeholder='فامیلی خود را وارد کنید'
                                        value={this.state.last_name}
                                        onChangeText={this.changeLastNameInput.bind(this)}
                                    />
                                </Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[general.text, { color: 'black' }]}>بایو</Text>
                            </Col>
                            <Col size={4}>
                                <Item >
                                    <Icon active name='md-headset' />
                                    <Input
                                        style={[general.text, { textAlign: 'right', fontSize: 16, paddingLeft: 12 }]}
                                        placeholder='بایو بنویسید'
                                        value={this.state.bio}
                                        onChangeText={this.changeBioInput.bind(this)}
                                    />
                                </Item>
                            </Col>
                        </Row>
                    </Grid>
                    <CardItem style={{ borderBottomWidth: 1, borderBottomColor: '#ddd', margin: 40, }}>
                        <Left>

                            <View style={{ height: '100%', alignItems: 'center' }}>
                                <TouchableOpacity transparent onPress={() => {
                                        this.props.setEdit({
                                            elementType: 'user',
                                            elementToEdit: 'addMoney',
                                            elementId: this.props.user.id,
                                            belongsTo: this.props.user.id,
                                        })
                                        Actions.editLightbox();
                                }}>
                                <Icon name="md-add-circle" />
                                </TouchableOpacity>
                            </View>
                            <Body style={{ alignItems: 'center' }}>
                                <TText>
                                    اعتبار حساب {this._numberWithCommas(this.props.user.remaining_money)} تومان
                                    </TText>
                            </Body>
                            {this._renderMoneyRefresh()}

                        </Left>
                    </CardItem>
                    <View style={{
                        position: 'absolute',
                        top: 20,
                        left: 40
                    }}>
                        {this._renderImage(this.props.user.profile_pic)}
                        <TouchableOpacity style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,

                        }}
                            onPress={() => {
                                this.props.setEdit({
                                    elementType: 'shop',
                                    elementToEdit: 'userImage',
                                    belongsTo: this.props.user.id,
                                })
                                Actions.editLightbox();
                            }}
                        >

                            <Icon name='md-add-circle' style={{ color: 'rgba(235, 89, 78,1)' }} />
                        </TouchableOpacity>
                    </View>


                </Content>
                <Footer style={{ display: this.state.showFooter }}>
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
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        notification: state.notification
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)