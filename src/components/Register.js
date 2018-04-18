import React from 'react';
import { Image, Dimensions, TouchableOpacity } from 'react-native';
import { Grid, Body, Col, Container, Header, View, Text, Left, Button, Right, Content, Form, Item, Icon, Input, Title } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { form, general } from './../assets/styles';
import { setUser } from "../redux/actions";
import { connect } from "react-redux";

class Register extends React.Component {
    componentWillMount() {
        this.setState({
            email: {
                value: '',
                error: ''
            },
            name: {
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
        const nameError = this.state.name.error;
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
                        <Title style={[general.text, { color: 'white' }]}>ثبت نام</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon name="md-arrow-back" style={{ color: '#fff' }} />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ paddingTop: width / 3 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Title style={[general.text, { color: 'black', fontSize: 30 }]}>محل کار شما</Title>
                        <Image source={require('../assets/images/logo.png')} style={{ width: 30, height: 30, position: 'absolute', top: 0, right: 35 }} />
                    </View>

                    <Form style={form.StyleForm}>
                        <Item rounded style={form.item} error={nameError !== ''}>
                            <Icon active name='md-person' />
                            <Input
                                placeholder='نام خود را وارد کنید'
                                style={form.input}
                                onChangeText={this.changeNameInput.bind(this)}
                            />
                        </Item>
                        <Text style={[form.error, this._checkDisplay(nameError)]}>{nameError}</Text>
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
                            <Text style={[form.submitText]}>عضویت</Text>
                        </Button>
                        <Grid style={{ marginTop: 10, padding: 10, paddingTop: 0 }}>
                            <Col>
                                <TouchableOpacity onPress={() => Actions.pop()}>
                                    <Text style={[general.text, { color: '#333', fontSize: 14 }]}>از قبل حساب دارم</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col>
                                <TouchableOpacity onPress={() => Actions.forgetPassword()}>
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

        let { email, password, name } = this.state;


        if (name.value === '') {
            this.setState({
                name: {
                    value: '',
                    error: 'لطفا فیلد نام را پر کنید'
                }
            });
            return;
        }

        if (email.value === '') {
            this.setState({
                email: {
                    value: '',
                    error: 'لطفا فیلد شماره همراه را پر کنید'
                }
            });
            return;
        } else if (email.value.match(/^[ ]*(?:0|\+|00)?(?:98)?9(\d{9})[ ]*$/) === null) {
            this.setState({
                email: {
                    value: '',
                    error: 'یک شماره همراه معتبر وارد کنید '
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
            password: password.value,
            name: name.value
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
    changeNameInput(text) {
        this.setState({
            name: {
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
            let { email, password, name } = params;
            const body = new FormData();
            postObj = {
                email,
                password,
                password_confirmation: password,
                first_name: name
            };

            var formData = new FormData();

            for (var k in postObj) {
                formData.append(k, postObj[k]);
            }

            var request = {
                method: 'POST',
                header: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            };

            let response = await fetch(`http://server.reservina.ir/users`, request);

            let json = await response.json();
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

export default connect(null, mapDispatchToProps)(Register)