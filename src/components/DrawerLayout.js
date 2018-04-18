import React from 'react';
import { View, Text, Item, Icon } from 'native-base';
import { Image } from "react-native";
import { drawer } from "../assets/styles";
import { deleteUser } from "../redux/actions";
import { Actions } from 'react-native-router-flux';
import { connect } from "react-redux";

class DrawerLayout extends React.Component {

    _renderPersonnelPage() {
        if(this.props.user.registered == 3 || this.props.user.registered == 4)
        return <Item style={drawer.item} onPress={() => Actions.pprofile()}>
            <Icon name="md-bowtie" style={drawer.itemIcon} />
            <Text style={drawer.itemTitle}>پرسنل</Text>
        </Item>
        return false;
    }
    _renderShopPage() {
        if(this.props.user.registered == 2 || this.props.user.registered == 4)
        return <Item style={drawer.item} onPress={() => Actions.ssettings()}>
            <Icon name="ios-pie-outline" style={drawer.itemIcon} />
            <Text style={drawer.itemTitle}>تنظیمات محل کار</Text>
        </Item>
        return false;
    }
    render() {
        return (
            <View style={drawer.container}>
                <Image source={require('../assets/images/sample_beauty_shop.jpg')} style={drawer.imageHeader} />
                <View>
                    <Item style={drawer.item} onPress={() => Actions.replace('home')}>
                        <Icon name="md-home" style={drawer.itemIcon} />
                        <Text style={drawer.itemTitle}>خانه</Text>
                    </Item>
                    <Item style={drawer.item} onPress={() => Actions.settings()}>
                        <Icon name="md-settings" style={drawer.itemIcon} />
                        <Text style={drawer.itemTitle}>تنظیمات</Text>
                    </Item>
                    {this._renderPersonnelPage()}
                    {this._renderShopPage()}
                    <Item style={drawer.item} onPress={() => {
                        this.props.deleteUser();
                        Actions.reset('auth');
                    }}>
                        <Icon name="md-log-out" style={drawer.itemIcon} />
                        <Text style={drawer.itemTitle}>خروج</Text>
                    </Item>
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteUser: () => {
            dispatch(deleteUser())
        }
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps , mapDispatchToProps)(DrawerLayout)