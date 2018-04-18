import React from 'react';
import { Image, Dimensions, TouchableOpacity } from 'react-native';
import { Grid, Body, Col, Container, Header, View, Text, Left, Button, Right, Content, Form, Item, Icon, Input, Title } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { form, general } from './../assets/styles';
import { setUserEmail } from "../redux/actions";
import { connect } from "react-redux";

class ForgetPassword extends React.Component {
    componentWillMount() {
        this.setState({
            email: {
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
                        <Item rounded style={form.item} error={emailError !== ''}>
                        <Icon active name='md-call' />
                            <Input
                                placeholder='شماره همراه خود را وارد کنید'
                                style={form.input}
                                onChangeText={this.changeEmailInput.bind(this)}
                            />
                            
                        </Item>
                        <Text style={[form.error, this._checkDisplay(emailError)]}>{emailError}</Text>

                        <Text style={[form.error, this._checkDisplay(generalError)]}>{generalError}</Text>
                        <Button disabled={buttonClicked} full style={[this._checkButtonDisplay(buttonClicked)]} onPress={this.ForgetPassword.bind(this)}>
                            <Text style={[form.submitText]}>ارسال کد بازیابی</Text>
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
    ForgetPassword() {

        let { email } = this.state;
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


        this.setState({
            button: {
                clicked: true
            }
        });

        this.requrestForgetPasswordFromApi({
            email: email.value,
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


    async requrestForgetPasswordFromApi(params) {
        try {
            let { email } = params;
            let response = await fetch(`http://server.reservina.ir/user/forget_password/get_code?email=${email}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let json = await response.json();
            // Actions.replace('forgetPasswordChange');
            if (response.status === 200) {
                // ForgetPassword
                if (json.result_code == 200) {
                    // console.log({email});
                    this.props.setUserEmail(email);
                    Actions.forgetPasswordChange();
                }



            } 
            else {
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
            // if (response.status === 422) {
            //     // Validate
            //     console.log('validate');
            // }

            // if (response.status === 302) {
            //     // Auth
            //     console.log('auth')
            // }

        } catch (error) {
            console.log(error);
        }
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUserEmail: user => {
            dispatch(setUserEmail(user))
        }
    }
}

export default connect(null, mapDispatchToProps)(ForgetPassword)