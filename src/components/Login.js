import React from 'react';
import { Image, Dimensions , TouchableOpacity } from 'react-native';
import { Grid,Body, Col, Container, Header, View, Text, Left, Button, Right, Content, Form, Item, Icon, Input, Title } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { form, general } from './../assets/styles';
import { setUser } from "../redux/actions";
import { connect } from "react-redux";

class Login extends React.Component {
    componentWillMount() {
        this.setState({
            email: {
                value: '',
                error: ''
            },
            password: {
                value: '',
                error: ''
            },
            general: {
                value: '',
                error: ''
            },
            button: {
                clicked: false
            }
        });
    }

    render() {
        const emailError = this.state.email.error;
        const buttonClicked = this.state.button.clicked;
        const passwordError = this.state.password.error;
        const generalError = this.state.general.error;
        var { x, y, width, height } = Dimensions.get('window');
        return (
            <Container>
                <Header style={{ backgroundColor: '#DC3023' }} androidStatusBarColor="#8F1D21" iosBarStyle="light-content">
                    <Left style={{ flex: 1 }}>
                    </Left>
                    <Body style={[general.title, { flex: 2 }]}>
                        <Title style={[general.text, { color: 'white' }]}>صفحه ورود</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content style={{ paddingTop: width / 3 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Title style={[general.text, { color: 'black', fontSize: 30 }]}>محل کار شما</Title>
                        <Image source={require('../assets/images/logo.png')} style={{ width: 30, height: 30, position: 'absolute', top: 0, right: 35 }} />
                    </View>

                    <Form style={form.StyleForm}>
                        <Item rounded style={form.item} error={emailError !== ''}>
                            <Icon active name='md-call' />
                            
                            <Input
                                placeholder='شماره همراه خود را وارد کنید'
                                style={form.input}
                                onChangeText={this.changeEmailInput.bind(this)}
                            />
                        </Item>
                        <Text style={[form.error, this._checkDisplay(emailError)]}>{emailError}</Text>
                        <Item rounded style={form.item} error={passwordError !== ''}>
                            <Icon active name='md-key' />
                            <Input
                                placeholder='پسورد خود را وارد کنید'
                                style={form.input}
                                secureTextEntry
                                onChangeText={this.changePasswordInput.bind(this)}
                            />
                        </Item>
                        <Text style={[form.error, this._checkDisplay(passwordError)]}>{passwordError}</Text>

                        <Text style={[form.error, this._checkDisplay(generalError)]}>{generalError}</Text>
                        <Button disabled={buttonClicked} full style={[this._checkButtonDisplay(buttonClicked)]} onPress={this.login.bind(this)}>
                            <Text style={[form.submitText]}>ورود</Text>
                        </Button>
                        <Grid style={{ marginTop: 10, padding: 10, paddingTop: 0 }}>
                            <Col>
                                <TouchableOpacity onPress={()=>Actions.register()}>
                                    <Text style={[general.text, { color: '#333', fontSize: 14 }]}>عضو شوید</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col>
                                <TouchableOpacity onPress={()=>Actions.forgetPassword()}>
                                    <Text style={[general.text, { color: '#333', fontSize: 14 }]}>پسورد را فراموش کرده‌ام</Text>
                                </TouchableOpacity>
                            </Col>
                        </Grid>
                    </Form>
                </Content>
            </Container>
        )
    }

    _checkDisplay(field) {
        return { display: field === '' ? 'none' : 'flex' }
    }
    _checkButtonDisplay(buttonClicked) {
        if (buttonClicked)
            return form.submitButtonClicked;
        else
            return form.submitButton
    }
    login() {

        let { email, password } = this.state;
        if (email.value === '') {
            this.setState({
                email: {
                    value: '',
                    error: 'لطفا فیلد شماره همراه را پر کنید'
                }
            });
            return;
        }

        if (password.value === '') {
            this.setState({
                password: {
                    value: '',
                    error: 'لطفا فیلد پسورد را پر کنید'
                }
            });
            return;
        }

        this.setState({
            button: {
                clicked: true
            }
        });

        this.requrestLoginFromApi({
            email: email.value,
            password: password.value
        })

    }

    changeEmailInput(text) {
        this.setState({
            email: {
                value: text,
                error: ''
            }
        })
    }

    changePasswordInput(text) {
        this.setState({
            password: {
                value: text,
                error: ''
            }
        })
    }

    async requrestLoginFromApi(params) {
        try {
            let { email, password } = params;
            let response = await fetch(`http://server.reservina.ir/mobile?username=${email}&password=${password}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let json = await response.json();
            console.log(json.result_message);
            if (response.status === 200) {
                // login
                if (json.result_code == 200) {
                    this.props.setUser(json.data);
                    Actions.reset('root');
                }
            } else {
                this.setState({
                    general: {
                        value: '',
                        error: json.result_message
                    },
                    button: {
                        clicked: false
                    }
                });
                return;
            }

            if (response.status === 422) {
                // Validate
                console.log('validate');
            }

            if (response.status === 302) {
                // Auth
                console.log('auth')
            }
            this.setState({
                button: {
                    clicked: false
                }
            });
        } catch (error) {
            console.log(error);
            this.setState({
                button: {
                    clicked: false
                }
            });
        }
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser: user => {
            dispatch(setUser(user))
        }
    }
}

export default connect(null, mapDispatchToProps)(Login)