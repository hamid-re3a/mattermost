import React from 'react';
import { ImageBackground, View, TouchableOpacity, FlatList } from "react-native";
import { Badge, Grid, Row, Col, Thumbnail, Container, Header, Body,Text, Button, Content, Left, Right, Icon, Footer, FooterTab, Title, H1, H3, Card, CardItem, Spinner } from 'native-base';
import TText from '../common/TText';
import { form, general, navigation, drawer } from '../../assets/styles';
import { Actions } from 'react-native-router-flux';
import { setEdit, setReserve } from '../../redux/actions/index';
import { connect } from 'react-redux';
import moment from 'moment-jalaali';
// import PushController from "../../components/PushController";
// import PushNotification from 'react-native-push-notification';


class PProfile extends React.Component {
    componentWillMount() {
    }



    _renderBadge(){
        if(parseInt(this.props.notification.count) > 0)
            return <Badge success style={{position:'absolute',top:0,right:0 }}>
            <TText style={{color:'white'}}>{this.props.notification.count}</TText>
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
                        <Title style={[general.text, { color: 'white' }]}>بخش پرسنلی</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>

                    </Right>
                </Header>
                <Content>
                    <Grid>
                        <Row style={{ padding: 20 }}>
                            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity transparent onPress={() => {
                                    this.props.setEdit({
                                        elementType: 'personnel',
                                        elementToEdit: 'addBusyHours',
                                        elementId: this.props.user.personnel_id,
                                        belongsTo: this.props.user.personnel_id,
                                    })
                                    Actions.editLightbox();
                                }}>
                                    <Thumbnail square source={require('../../assets/images/hand-time.png')} style={{ marginBottom: 5 }} />
                                </TouchableOpacity>
                                <TouchableOpacity transparent onPress={() => {
                                    this.props.setEdit({
                                        elementType: 'personnel',
                                        elementToEdit: 'addBusyHours',
                                        elementId: this.props.user.personnel_id,
                                        belongsTo: this.props.user.personnel_id,
                                    })
                                    Actions.editLightbox();
                                }}>
                                    <TText>
                                        پر کردن ساعت
                                    </TText>
                                </TouchableOpacity>
                            </Col>
                            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity transparent onPress={() => {
                                    Actions.reserve();
                                }}>
                                <Thumbnail square source={require('../../assets/images/clipboard.png')} style={{ marginBottom: 5 }} />
                                </TouchableOpacity>
                                <TouchableOpacity transparent onPress={() => {
                                     Actions.reserve();
                                }}>
                                <TText>
                                    رزروهای بی پاسخ
                                </TText>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        <Row style={{ padding: 20 }}>
                            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity transparent onPress={() => {
                                    this.props.setEdit({
                                        elementType: 'personnel',
                                        elementToEdit: 'personnelSetTimes',
                                        elementId: this.props.user.personnel_id,
                                        belongsTo: this.props.user.personnel_id,
                                    })
                                    Actions.editLightbox();
                                }}>
                                    <Thumbnail square source={require('../../assets/images/set-time.png')} style={{ marginBottom: 5 }} />
                                </TouchableOpacity>
                                <TouchableOpacity transparent onPress={() => {
                                    this.props.setEdit({
                                        elementType: 'personnel',
                                        elementToEdit: 'personnelSetTimes',
                                        elementId: this.props.user.personnel_id,
                                        belongsTo: this.props.user.personnel_id,
                                    })
                                    Actions.editLightbox();
                                }}>
                                    <TText>
                                        تنظیم ساعت کاری
                                    </TText>
                                </TouchableOpacity>
                            </Col>
                            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity transparent onPress={() => {
                                    Actions.pplan();
                                }}>
                                <Thumbnail square source={require('../../assets/images/calendar.png')} style={{ marginBottom: 5 }} />
                                </TouchableOpacity>
                                <TouchableOpacity transparent onPress={() => {
                                    Actions.pplan();
                                }}>
                                <TText>
                                    برنامه کاری
                                </TText>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        <Row style={{ padding: 20 }}>
                            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity transparent onPress={() => {
                                    this.props.setEdit({
                                        elementType: 'personnel',
                                        elementToEdit: 'personnelAddService',
                                        elementId: this.props.user.personnel_id,
                                        belongsTo: this.props.user.personnel_id,
                                    })
                                    Actions.editLightbox();
                                }}>
                                    <Thumbnail square source={require('../../assets/images/add-service.png')} style={{ marginBottom: 5 }} />
                                </TouchableOpacity>
                                <TouchableOpacity transparent onPress={() => {
                                    this.props.setEdit({
                                        elementType: 'personnel',
                                        elementToEdit: 'personnelAddService',
                                        elementId: this.props.user.personnel_id,
                                        belongsTo: this.props.user.personnel_id,
                                    })
                                    Actions.editLightbox();
                                }}>
                                    <TText>
                                        افزودن سرویس جدید
                                </TText>
                                </TouchableOpacity>
                            </Col>
                            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity transparent onPress={() => {
                                    this.props.setEdit({
                                        elementType: 'personnel',
                                        elementToEdit: 'personnelShowServices',
                                        elementId: this.props.user.personnel_id,
                                        belongsTo: this.props.user.personnel_id,
                                    })
                                    Actions.editLightbox();
                                }}>
                                    <Thumbnail square source={require('../../assets/images/specialist-user.png')} style={{ marginBottom: 5 }} />
                                </TouchableOpacity>
                                <TouchableOpacity transparent onPress={() => {
                                    this.props.setEdit({
                                        elementType: 'personnel',
                                        elementToEdit: 'personnelShowServices',
                                        elementId: this.props.user.personnel_id,
                                        belongsTo: this.props.user.personnel_id,
                                    })
                                    Actions.editLightbox();
                                }}>
                                    <TText>
                                        سرویس های کاری من
                                </TText>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        <Row style={{ padding: 20 }}>
                            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity transparent onPress={() => {
                                    this.props.setEdit({
                                        elementType: 'personnel',
                                        elementToEdit: 'personnelResignate',
                                        elementId: this.props.user.personnel_id,
                                        belongsTo: this.props.user.personnel_id,
                                    })
                                    Actions.editLightbox();
                                }}>
                                    <Thumbnail square source={require('../../assets/images/resignate.png')} style={{ marginBottom: 5 }} />

                                </TouchableOpacity>
                                <TouchableOpacity transparent onPress={() => {
                                    this.props.setEdit({
                                        elementType: 'personnel',
                                        elementToEdit: 'personnelResignate',
                                        elementId: this.props.user.personnel_id,
                                        belongsTo: this.props.user.personnel_id,
                                    })
                                    Actions.editLightbox();
                                }}>
                                    <TText>
                                        استعفا از محل کار
                                </TText>

                                </TouchableOpacity>
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
        setReserve: reserve => {
            dispatch(setReserve(reserve))
        },
        setEdit: edit => {
            dispatch(setEdit(edit))
        },
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        notification: state.notification
        // rehydrated : state.rehydrated
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PProfile)