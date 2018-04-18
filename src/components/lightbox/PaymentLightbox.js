import React from 'react';
import { Animated, View, TouchableOpacity, Linking } from 'react-native';
import { Button, Icon, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { setEdit } from '../../redux/actions/index';
import TText from '../common/TText';
import TH2 from '../common/TH2';
import BaseLightbox from "./BaseLightbox";
import { connect } from 'react-redux';

class PaymentLightbox extends React.Component {

    componentWillMount() {
        
        this.setState({
            step: 0,
            remaining_money: 0,
            payment_type: null,
            current_reserve: null,
            payOnline: 0
        });
        this._getRemainingMoney()
            .then((remaining_money) => {
                this.setState({ remaining_money })
            })
            .catch(() => console.log('nothing'));

    }
    async _request( toUrl, method = 'POST') {
        try {
            var request = {
                method,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                }
            };

            let response = await fetch(toUrl, request);
            let json = await response.json();
            return json;
        } catch (error) {
        }
    }
    

    async _getRemainingMoney() {
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
            return json.data.remaining_money;
        } catch (error) {
            // console.log(error);
        }
    }

    async _getRequestReserve(payment_type) {
        try {
            let { service_id, date, start_time } = this.props.reserveInfo;

            postObj = {
                shop_service_id: service_id,
                date,
                start_time,
                payment_type
            };

            var formData = new FormData();

            for (var k in postObj) {
                formData.append(k, postObj[k]);
            }

            var request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                },
                body: formData
            };

            let response = await fetch('http://server.reservina.ir/reserve_requests', request);
            let json = await response.json();
            return json;
        } catch (error) {
            // this.setState({
            //     step: 6
            // });
        }
    }

    async _getRequestReserveTransaction(remaining_money) {
        try {
            let { current_reserve } = this.state;

            postObj = {
                reserve_request_id: current_reserve.id,
                from_remaining_money: remaining_money,
            };

            var formData = new FormData();

            for (var k in postObj) {
                formData.append(k, postObj[k]);
            }

            var request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                },
                body: formData
            };

            let response = await fetch('http://server.reservina.ir/reserve_transaction', request);
            let json = await response.json();
            return json;
        } catch (error) {
            // this.setState({
            //     step: 6
            // });
        }
    }

    _numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    _requestReserve(paymentType) {
        this.setState({
            step: 5,
            payment_type: paymentType
        })
        this._getRequestReserve(paymentType)
            .then(res => {
                if (paymentType == 0) {
                    this.setState({
                        step: 2
                    })
                } else {
                    if (res.result_code == '200') {
                        this.setState({
                            step: 1,
                            current_reserve: res.data
                        });
                    } else {
                        this.setState({
                            step: 6
                        });
                    }
                }

            })
            .catch(res => {
                    this.setState({
                        step: 0
                    })
            })

    }

    _requestReserveTransaction(remaining_money) {
        this.setState({
            step: 5
        })
        this._getRequestReserveTransaction(remaining_money)
            .then((json) => {


                if (remaining_money == 0) {
                    Linking.openURL(json.data.url)
                }

                this.setState({
                    step: 2
                });
            })
            .catch(() => this.setState({
                step: 1
            }))


    }

    _renderSteps() {
        if(this.props.user.actived == 0){
           return this._renderUserActivation();
        }

        if (this.state.step == 1)
            return this._renderPayStep();
        if (this.state.step == 2)
            return this._renderFinalStep();
        else if (this.state.step == 5)
            return this._renderLoadingStep();
        else if (this.state.step == 6)
            return this._renderErrorStep();
        
        

        return this._renderPaymentTypeStep();
    }
    _renderPayStep() {


        let remaining_money = parseInt(this.state.remaining_money);
        // console.log(remaining_money);
        var price = parseInt(this.props.reserveInfo.service_price.replace(',', '').replace(',', ''));
        if (price < 1000)
            price = 1000;
        let depoPrice = price * 10 / 100;
        if (depoPrice < 1000)
            depoPrice = 1000;
        var items = [];
        if ((this.state.payment_type == 1 && remaining_money > depoPrice) || (this.state.payment_type == 2 && remaining_money > price))
            items.push(<Button key={1} block full style={{ borderRadius: 8, marginTop: 10 }}
                onPress={() => this._requestReserveTransaction(1)}
            >
                <TText  style={{color: 'white'}}> پرداخت از اعتبار </TText>
            </Button>);
        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>پرداخت</TH2>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 40 }}>
                {items}
                <Button block full style={{ borderRadius: 8, marginTop: 10 }}
                    onPress={() => {
                        this.setState({ payOnline: 1 })
                        this._requestReserveTransaction(0)
                    }
                    }
                >
                    <TText  style={{color: 'white'}}> پرداخت آنلاین </TText>
                </Button>
            </View>
        </View>


    }
    _renderFinalStep() {

        if (this.state.payOnline)
            return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                <TH2>هشدار!</TH2>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 40 }}>

                    <TText>رزرو شما با موفقیت انجام شد در صورتی که اقدام به پرداخت مبلغ رزرو نکنید ، رزرو شما کنسل خواهد شد</TText>

                </View>
            </View>

        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2></TH2>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 40 }}>

                <TText>رزرو شما با موفقیت انجام شد</TText>

            </View>
        </View>

    }
    _renderLoadingStep() {


        return <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <TText>لطفا اندکی صبر کنید</TText>
            <Spinner />
        </View>
    }

    _renderErrorStep() {


        return <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <TText>امکان انجام این رزرو وجود ندارد</TText>
        </View>
    }


    _renderPaymentTypeStep() {
        var price = parseInt(this.props.reserveInfo.service_price.replace(',', '').replace(',', ''));
        var depoPrice = price * 10 / 100;
        if (depoPrice < 1000)
            depoPrice = 1000;
        if (price < 1000)
            price = 1000;
        var items = [];
        if (this.props.shop.free_reservation)
            items.push(<Button key={1} block full style={{ borderRadius: 8, marginTop: 50 }}
                onPress={() => this._requestReserve(0)}
            >
                <TText style={{color: 'white'}}>پرداخت در محل</TText>
            </Button>);

        items.push()
        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>روش پرداخت</TH2>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                {items}
                <Button block full style={{ borderRadius: 8, marginTop: 10 }}
                    onPress={() => this._requestReserve(1)}
                >
                    <TText style={{color: 'white'}}>بیانه {this._numberWithCommas(depoPrice)} تومان</TText>
                </Button>
                <Button block full style={{ borderRadius: 8, marginTop: 10 }}
                    onPress={() => this._requestReserve(2)}
                >
                    <TText style={{color: 'white'}}> کل مبلغ {this._numberWithCommas(price)} تومان</TText>
                </Button>
            </View>
        </View>
    }
    _renderUserActivation() {
        
        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>فعالسازی حساب</TH2>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
               
                <Button block full style={{ borderRadius: 8, marginTop: 30 }}
                    onPress={() => {
                        toUrl = `http://server.reservina.ir/user/activation/get_get`;
                        this._request(toUrl)
                        this.props.setEdit({
                            elementType: 'activation',
                            elementToEdit: 'userActivation',
                            elementId: this.props.user.id,
                            belongsTo: this.props.user.id,
                        })
                        Actions.editLightbox();
                    }}
                >
                    <TText style={{color: 'white'}}>ارسال کد فعالسازی</TText>
                </Button>
            </View>
        </View>
    }

    render() {
        return (
            <BaseLightbox verticalPercent={0.7} horizontalPercent={0.5}>

                {this._renderSteps()}

            </BaseLightbox>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setEdit: edit => {
            dispatch(setEdit(edit))
        }
    }
}
const mapStateToProps = (state) => {
    return {
        shop: state.shop,
        user: state.user,
        reserveInfo: state.reserveInfo
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentLightbox)