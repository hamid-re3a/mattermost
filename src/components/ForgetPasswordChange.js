import React from 'react';
import { Image, Dimensions, TouchableOpacity } from 'react-native';
import { Grid, Body, Col, Container, Header, View, Text, Left, Button, Right, Content, Form, Item, Icon, Input, Title } from 'native-base';

import { form, general } from './../assets/styles';
import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';

class ForgetPasswordChange extends React.Component {
    componentWillMount() {
        this.setState({
            code: {
                value: '',
                error: ''
            },
            password: {
                value: '',
                error: ''
            },
            password_confirmation: {
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
        const codeError = this.state.code.error;
        const passwordError = this.state.password.error;
        const passwordConfirmationError = this.state.password_confirmation.error;
        const buttonClicked = this.state.button.clicked;
        const generalError = this.state.general.error;
        var { x, y, width, height } = Dimensions.get('window');
        return (
            <Container>
                <Header style={{ backgroundColor: '#3498db' }} androidStatusBarColor="#8F1D21" iosBarStyle="light-content">
                    <Left style={{ flex: 1 }}>
                    </Left>
                    <Body style={[general.title, { flex: 2 }]}>
                        <Title style={[general.text, { color: 'white' }]}>بازیابی رمزعبور</Title>
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
                        <Item rounded style={form.item} error={codeError !== ''}>
                            <Icon active name='md-call' />
                            <Input
                                placeholder='کد ارسال شده خود را وارد کنید'
                                style={form.input}
                                onChangeText={this.changeCodeInput.bind(this)}
                            />
                        </Item>
                        <Text style={[form.error, this._checkDisplay(codeError)]}>{codeError}</Text>
                        <Item rounded style={form.item} error={passwordError !== ''}>
                            <Icon active name='md-call' />
                            <Input
                                placeholder='پسورد جدید خود را وارد کنید'
                                style={form.input}
                                secureTextEntry
                                onChangeText={this.changePasswordInput.bind(this)}
                            />
                        </Item>
                        <Text style={[form.error, this._checkDisplay(passwordError)]}>{passwordError}</Text>

                        <Item rounded style={form.item} error={passwordConfirmationError !== ''}>
                            <Icon active name='md-call' />
                            <Input
                                placeholder='تکرار پسورد جدید'
                                style={form.input}
                                secureTextEntry
                                onChangeText={this.changePasswordConfirmationInput.bind(this)}
                            />
                        </Item>
                        <Text style={[form.error, this._checkDisplay(passwordConfirmationError)]}>{passwordConfirmationError}</Text>

                        <Text style={[form.error, this._checkDisplay(generalError)]}>{generalError}</Text>
                        <Button disabled={buttonClicked} full style={[this._checkButtonDisplay(buttonClicked)]} onPress={this.ForgetPasswordChange.bind(this)}>
                            <Text style={[form.submitText]}>تغییر رمز</Text>
                        </Button>
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
    ForgetPasswordChange() {

        let { code, password, password_confirmation } = this.state;
        if (code.value === '') {
            this.setState({
                code: {
                    value: '',
                    error: 'لطفا فیلد کد را پر کنید'
                }
            });
            return;
        } else if (code.value.match(/^\d{4,8}$/) === null) {
            this.setState({
                code: {
                    value: '',
                    error: 'یک کد معتبر وارد کنید '
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

        if (password_confirmation.value === '') {
            this.setState({
                password_confirmation: {
                    value: '',
                    error: 'لطفا فیلد تکرار پسورد را پر کنید'
                }
            });
            return;
        } else if (password.value.match(/^.{6,}$/) === null) {
            this.setState({
                password: {
                    value: '',
                    error: 'یک پسورد معتبر وارد کنید '
                }
            });
            return;

        } else if (password.value !== password_confirmation.value) {
            this.setState({
                password_confirmation: {
                    value: '',
                    error: 'پسوردها با هم مطابقت ندارند '
                }
            });
            return;

        }


        this.setState({
            button: {
                clicked: true
            }
        });

        this.requrestForgetPasswordChangeFromApi({
            code: code.value,
            password_confirmation: password_confirmation.value,
            password: password.value,
            email: parseInt(this.props.user.email),
        })

    }

    changeCodeInput(text) {
        this.setState({
            code: {
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
    changePasswordConfirmationInput(text) {
        this.setState({
            password_confirmation: {
                value: text,
                error: ''
            }
        })
    }
    async requrestForgetPasswordChangeFromApi(params) {
        try {
            let { email, password_confirmation, password, code } = params;
            let response = await fetch(`http://server.reservina.ir/user/forget_password/change_password?email=${email}&code=${code}&password=${password}&password_confirmation=${password_confirmation}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let json = await response.json();
            console.log(json.result_message);
            if (response.status === 200) {
                // ForgetPasswordChange
                if (json.result_code == 200) {   
                    Actions.reset('auth');
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

        } catch (error) {
            console.log(error);
        }
    }
}
const mapStateToProps = (state) => {
    return {
        user : state.user,
    }
}
export default connect(mapStateToProps, null)(ForgetPasswordChange)