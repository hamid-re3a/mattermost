import React from 'react';
import { View, Text, I18nManager } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Router, Scene, Lightbox, Drawer } from 'react-native-router-flux';
import { connect, Provider } from 'react-redux';

EStyleSheet.build({
    $statusBarColor: '#8F1D21',
    $headerColor: '#3498db',
    $mainColor: '#3498db',
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
import DrawerLayout from "./components/DrawerLayout";
import store from "./redux/store";
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
                                    </Scene>
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