import React from 'react';
import { View, Text, I18nManager } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Router, Scene, Lightbox, Drawer } from 'react-native-router-flux';
import { connect, Provider } from 'react-redux';

EStyleSheet.build({
    $statusBarColor: '#8F1D21',
    $headerColor: '#DC3023',
    $mainColor: '#DC3023',
    $IS: 'IRANSansMobile'
})

// Components
import Login from "./components/Login";
import Register from "./components/Register";
import ForgetPassword from "./components/ForgetPassword";
import ForgetPasswordChange from "./components/ForgetPasswordChange";
import LoginLightbox from "./components/lightbox/LoginLightbox";
import Splash from "./components/Splash";
import Internet from "./components/Internet";
import Home from "./components/root/Home";
import Personnel from "./components/root/Personnel";
import PProfile from "./components/root/PProfile";
import PPlan from "./components/root/PPlan";
import Profile from "./components/root/Profile";
import NReserves from "./components/root/NReserves";
import Reserves from "./components/root/Reserves";
import Reserve from "./components/root/Reserve";
import DrawerLayout from "./components/DrawerLayout";
import Settings from "./components/root/Settings";
import SSettings from "./components/root/SSettings";
import store from "./redux/store";
import Notifications from './components/root/Notifications';
import ProfileLightbox from './components/lightbox/ProfileLightbox';
import PaymentLightbox from './components/lightbox/PaymentLightbox';
import LatePaymentLightbox from './components/lightbox/LatePaymentLightbox';
import EditLightbox from './components/lightbox/EditLightbox';
I18nManager.forceRTL(true);

export default class App extends React.Component {
    render() {
        const RouterWithRedux = connect()(Router);
        return (
            <Provider store={store}>
                <RouterWithRedux>
                    <Scene hideNavBar>
                        <Scene key="root" hideNavBar>
                            <Drawer
                                key="drawer"
                                contentComponent={DrawerLayout}
                                drawerPosition="right"
                            >
                                <Lightbox key="kolan2">
                                    <Scene key="kolan3" hideNavBar>
                                        <Scene key="home" component={Home} initial />
                                        <Scene key="notifications" component={Notifications} />
                                        <Scene key="personnel" component={Personnel} />
                                        <Scene key="pprofile" component={PProfile} />
                                        <Scene key="pplan" component={PPlan} />
                                        <Scene key="profile" component={Profile} />
                                        <Scene key="reserve" component={Reserve} />
                                        <Scene key="past_reserve" component={NReserves} />
                                        <Scene key="future_reserve" component={Reserves} />
                                        <Scene key="settings" component={Settings} />
                                        <Scene key="ssettings" component={SSettings} />
                                    </Scene>
                                    <Scene hideNavBar key="profileLightbox" component={ProfileLightbox} />
                                    <Scene hideNavBar key="paymentLightbox" component={PaymentLightbox} />
                                    <Scene hideNavBar key="editLightbox" component={EditLightbox} />
                                    <Scene hideNavBar key="latePaymentLightbox" component={LatePaymentLightbox} />
                                </Lightbox>
                            </Drawer>

                        </Scene>
                        <Lightbox key="auth">
                            <Scene key="kolan" hideNavBar initial>
                                <Scene key="login" component={Login} initial />
                                <Scene key="register" component={Register} />
                                <Scene key="forgetPassword" component={ForgetPassword} />
                                <Scene key="forgetPasswordChange" component={ForgetPasswordChange} />
                            </Scene>

                            <Scene key="loginLightbox" component={LoginLightbox} />
                        </Lightbox>
                        <Scene key="splash" component={Splash} initial />
                        <Scene key="internet" component={Internet}  />
                    </Scene>
                </RouterWithRedux>
            </Provider>
        )
    }
}