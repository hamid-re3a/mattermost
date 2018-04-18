import React from 'react';
import {View} from 'react-native';
import { Container, Header, Right, Button, Content, Text, Left, Icon, Title,Switch, Body, Footer, FooterTab, Badge,Item,Grid,Row, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { form, general, navigation, drawer } from '../../assets/styles';

import { connect } from 'react-redux';
import { setEdit, updateUser } from '../../redux/actions/index';


class Settings extends React.Component {
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
                        <Title style={[general.text, { color: 'white' }]}>اعلان‌ها</Title>
                    </View>
                    <Grid>
                        <Row style={{height:55,backgroundColor:'#f1f1f1'}}>
                            <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Icon active name='notifications' />
                                
                            </Col>
                            <Col size={3}  style={{ justifyContent: 'center',alignItems: 'flex-start', paddingLeft: 20 }}>                                    
                                <Text style={[general.text, { color: 'black' }]}>اعلان‌های برنامه</Text>
                            </Col>
                            
                            <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Switch value={this.props.user.notifications} onValueChange={()=>{
                                    this.props.updateUser({notifications: !this.props.user.notifications})
                                }}/>
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
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        notification: state.notification
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings)