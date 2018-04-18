import React from 'react';
import { Image, Animated, View, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Content, Grid, Row, Col, Item, Button, Icon, Input, Spinner } from 'native-base';

import TText from '../common/TText';
import TH2 from '../common/TH2';
import BaseLightbox from "./BaseLightbox";
import ImageCropperPicker from 'react-native-image-crop-picker';
import { picker } from "../ImagePicker";
import { updateShop, deleteShopPersonnel, updateUser } from '../../redux/actions/index';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import ShowTime from '../common/ShowTime';
import ShowDay from '../common/ShowDay';

class EditLightbox extends React.Component {

    componentWillMount() {

        this.setState({
            step: 0,
            remaining_money: 0,
            payment_type: null,
            current_reserve: null,
            payOnline: 0,
            input: null,
            error: null,
            imageSource: null,
            personnel_free_days: null,
            personnel_services: null,
            fake_reserve: {
                absentHours: [
                    { 'hour': '00:30' }, { 'hour': '1:00' }, { 'hour': '1:30' }, { 'hour': '02:00' }, { 'hour': '02:30' },
                    { 'hour': '3:00' }, { 'hour': '3:30' }, { 'hour': '2:00' }, { 'hour': '4:30' },
                    { 'hour': '5:00' }, { 'hour': '5:30' }, { 'hour': '6:00' }, { 'hour': '6:30' },
                    { 'hour': '7:00' }, { 'hour': '7:30' }, { 'hour': '8:00' }
                ]
            },
            time_length: [
                { 'hour': '00:10' },{ 'hour': '00:15' },{ 'hour': '00:30' }, { 'hour': '1:00' }, { 'hour': '1:30' }, { 'hour': '02:00' }, { 'hour': '02:30' },
                { 'hour': '3:00' }, { 'hour': '3:30' }, { 'hour': '2:00' }, { 'hour': '4:30' },
                { 'hour': '5:00' }, { 'hour': '5:30' }, { 'hour': '6:00' }, { 'hour': '6:30' },
                { 'hour': '7:00' }, { 'hour': '7:30' }, { 'hour': '8:00' }
            ],
            set_time: {
                personnel_work_times: null,
                message: null,
            },
            add_service: {
                service_name: null,
                service_price: null,
                message: null,
            },
            enter_hours: [
                { 'hour': '5:00' }, { 'hour': '5:30' }, { 'hour': '6:00' }, { 'hour': '6:30' },
                { 'hour': '7:00' }, { 'hour': '7:30' }, { 'hour': '8:00' }, { 'hour': '8:30' },
                { 'hour': '9:00' }, { 'hour': '9:30' }, { 'hour': '10:00' }, { 'hour': '10:30' },
                { 'hour': '11:00' }, { 'hour': '11:30' }, { 'hour': '12:00' }, { 'hour': '12:30' },
                { 'hour': '13:00' }, { 'hour': '13:30' }, { 'hour': '14:00' }, { 'hour': '14:30' },
                { 'hour': '15:00' }, { 'hour': '15:30' }, { 'hour': '16:00' }, { 'hour': '16:30' },
                { 'hour': '17:00' }, { 'hour': '17:30' }, { 'hour': '18:00' }
            ],
            exit_hours: [
                { 'hour': '8:00' }, { 'hour': '8:30' },
                { 'hour': '9:00' }, { 'hour': '9:30' }, { 'hour': '10:00' }, { 'hour': '10:30' },
                { 'hour': '11:00' }, { 'hour': '11:30' }, { 'hour': '12:00' }, { 'hour': '12:30' },
                { 'hour': '13:00' }, { 'hour': '13:30' }, { 'hour': '14:00' }, { 'hour': '14:30' },
                { 'hour': '15:00' }, { 'hour': '15:30' }, { 'hour': '16:00' }, { 'hour': '16:30' },
                { 'hour': '17:00' }, { 'hour': '17:30' }, { 'hour': '18:00' }, { 'hour': '18:30' },
                { 'hour': '19:00' }, { 'hour': '19:30' }, { 'hour': '20:00' }, { 'hour': '20:30' },
                { 'hour': '21:00' }, { 'hour': '21:30' }, { 'hour': '22:00' }, { 'hour': '22:30' },
            ],

            personnel_work_day: null
        });


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

    async _request(postObj, toUrl, method = 'POST') {
        try {

            // var formData = new FormData();

            // for (var k in postObj) {
            //     formData.append(k, postObj[k]);
            // }

            var request = {
                method,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                },
                // body: formData
            };

            let response = await fetch(toUrl, request);
            let json = await response.json();
            return json;
        } catch (error) {
            // this.setState({
            //     step: 6
            // });
        }
    }
    async _uploadImage(postObj, toUrl, method = 'POST') {
        try {

            var formData = new FormData();

            for (var k in postObj) {
                formData.append(k, postObj[k]);
            }
            // formData.append('profile_pic', postObj);
            // console.log(formData);
            // formData.append('profile_pic', 'ali');
            // formData.append('profile_pic', photo);
            var request = {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                },
                body: formData
            };

            let response = await fetch(toUrl, request);
            let json = await response.json();
            // console.log(json);
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


    _renderSteps() {
        let title;
        let toUrl;
        let inputPlaceHolder;
        let question;
        if (this.state.message != undefined && this.state.message != null) {
            return this._renderFinalStep()
        }
        switch (this.props.edit.elementToEdit) {
            case 'addMoney':
                title = 'افزودن اعتبار';
                return this._renderAddMoney(title);
                break;
            case 'userActivation':
            
                title = 'فعالسازی حساب';
                inputPlaceHolder = 'کد فعالسازی را وارد کنید';

                return this._renderTTextEdit(title, inputPlaceHolder);
                break;
            case 'BackgroundImage':

                title = 'عکس محل کار';
                return this._renderSelectPicture(title);
                break;
            case 'userImage':

                title = 'عکس پروفایل';
                return this._renderUserSelectPicture(title);
                break;
            case 'shopAlias':
                title = 'تغییر نام';
                inputPlaceHolder = 'نام جدید را وارد کنید';

                return this._renderTTextEdit(title, inputPlaceHolder);
                break;
            case 'shopAddress':
                title = 'تغییر آدرس';
                inputPlaceHolder = 'آدرس جدید را وارد کنید';

                return this._renderTTextEdit(title, inputPlaceHolder);
                break;
            case 'shopPhone':
                title = 'تغییر شماره تلفن';
                inputPlaceHolder = 'شماره تلفن جدید را وارد کنید';

                return this._renderTTextEdit(title, inputPlaceHolder);
                break;

            case 'shopAddPersonnel':
                title = 'افزودن پرسنل';
                inputPlaceHolder = 'شماره تلفن شخص مورد نظر را وارد کنید';

                return this._renderTTextEdit(title, inputPlaceHolder);
                break;
            case 'shopDeletePersonnel':
                title = 'حذف پرسنل';
                question = 'آیا مطمئن هستید؟';

                return this._renderYNQuestion(title, question);
                break;

            case 'personnelResignate':
                title = 'استعفا پرسنل';
                question = 'آیا مطمئن هستید؟';

                return this._renderYNQuestion(title, question);
                break;
            case 'cancelReserve':
                title = 'کنسل کردن قرار';
                question = 'آیا مطمئن هستید؟';

                return this._renderYNQuestion(title, question);
                break;
            case 'addBusyHours':
                title = 'پر کردن ساعت';
                if (this.state.personnel_free_days == null)
                    this._getPersonnelFreeDays(this.props.user.personnel_id)
                        .then((res) => {
                            this.setState({
                                personnel_free_days: res
                            })
                        })
                return this._renderAddHour(title);
                break;
            case 'personnelSetTimes':
                title = 'تنظیم ساعت کاری';
                toUrl = 'http://server.reservina.ir/personnel_work_times';
                if (this.state.set_time.personnel_work_times == null)
                    this._request({}, toUrl, 'GET')
                        .then((res) => {
                            this.setState({
                                set_time: {
                                    ...this.state.set_time,
                                    personnel_work_times: res.data
                                }

                            })
                        })
                return this._renderSetTime(title);
                break;
            case 'personnelShowServices':
                title = 'مشاهده سرویس ها';
                toUrl = `http://server.reservina.ir/shop_personnel/${this.props.user.personnel_id}`;
                if (this.state.personnel_services == null)
                    this._request({}, toUrl, 'GET')
                        .then((res) => {
                            this.setState({
                                personnel_services: res.data.services
                            })
                        })
                return this._renderShowServices(title);
                break;
            case 'personnelAddService':
                title = 'افزودن سرویس کاری';
                return this._renderAddService(title);
                break;
        }
        // return this._renderFinalStep();

    }
    changeInput(TText) {
        this.setState({
            input: TText
        })
    }

    _handleRequest() {
        var postObj = {};
        var toUrl;
        var type;
        switch (this.props.edit.elementToEdit) {
            case 'BackgroundImage':
                break;
            case 'shopAlias':
                postObj = {
                    alias: this.state.input
                };
                toUrl = `http://server.reservina.ir/shops/update/${this.props.edit.belongsTo}?alias=${this.state.input}`;
                break;
            case 'userActivation':
                toUrl = `http://server.reservina.ir/user/activation/code?activation_code=${this.state.input}`;
                break;
            case 'shopAddress':
                postObj = {
                    work_address: this.state.input
                };
                toUrl = `http://server.reservina.ir/shops/update/${this.props.edit.belongsTo}?work_address=${this.state.input}`;
                break;
            case 'shopPhone':
                postObj = {
                    work_phone: this.state.input
                };
                toUrl = `http://server.reservina.ir/shops/update/${this.props.edit.belongsTo}?work_phone=${this.state.input}`;
                break;
            case 'shopAddPersonnel':

                toUrl = `http://server.reservina.ir/shop_personnel?phone_no=${this.state.input}&shop_id=${this.props.edit.belongsTo}`;
                break;
            case 'shopDeletePersonnel':
                this.props.deleteShopPersonnel({ id: this.props.edit.elementId });
                toUrl = `http://server.reservina.ir/shop_personnel/${this.props.edit.elementId}`;
                type = 'DELETE';
                break;
            case 'personnelResignate':
                this.props.deleteShopPersonnel({ id: this.props.edit.elementId });
                toUrl = `http://server.reservina.ir/shop_personnel/${this.props.edit.elementId}`;
                type = 'DELETE';
                break;
                
            case 'cancelReserve':
            // this.props.deleteShopPersonnel({ id: this.props.edit.elementId });
                toUrl = `http://server.reservina.ir/reserve_requests/${this.props.edit.elementId}`;
                type = 'DELETE';
                break;
            default:
                return true;
                break;
        }

        this._request(postObj, toUrl, type)
            .then((res) => {
                if (res != undefined) {
                    if (res.result_code == '200') {
                        if(this.props.edit.elementToEdit == 'userActivation'){
                            this.props.updateUser(res.data);
                        }
                        this.props.updateShop(postObj);

                        this.setState({
                            message: res.result_message
                        })
                    } else {
                        this.setState({
                            error: res.result_message
                        })
                    }
                } else {
                    this.setState({
                        error: 'خطا در دریافت اطلاعات '
                    })
                }


            })
            .catch((error) => {
                this.setState({
                    error
                })
                // Actions.pop();
            })
    }
    renderImageSelected(src, res) {

        if (src != null && src != undefined) {
            var path = res.path;
            var eWidth, eHeight, width, height;
            eWidth = res.width;
            eHeight = res.height;
            if (res.width > 100) {
                eWidth = 100;
                eHeight = res.height * 100 / res.width;
            }
            if (eHeight > 100) {
                eHeight = 100;
                eWidth = eWidth * 100 / eHeight;
            }
            width = eWidth;
            height = eHeight;

            return <Image source={src} style={{ width, height }} />

        }

        return false;
    }
    renderImageOptions() {
        if (this.state.step == 1) {
            return <ScrollView style={{ padding: 20 }}>
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                        () => {
                            ImageCropperPicker.openCropper({
                                path: this.state.imageResponse.uri,
                                width: 3000,
                                height: 3000
                            })
                                .then(image => {
                                    this.setState({ imageSource: { uri: image.path }, imageResponse: image, step: 2 });
                                });
                        }
                    }>
                        <TText>بریدن مربعی</TText>
                    </Button>

                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                        () => {
                            ImageCropperPicker.openCropper({
                                path: this.state.imageResponse.uri,
                                width: 3000,
                                height: 1500
                            })
                                .then(image => {
                                    this.setState({ imageSource: { uri: image.path }, imageResponse: image, step: 2 });
                                });
                        }
                    }>
                        <TText>بریدن مستطیلی</TText>
                    </Button>
                </View>
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                        () => {
                            var profile_pic = {
                                uri: this.state.imageSource.uri,
                                type: 'image/jpeg',
                                name: 'photo.jpg',
                            };
                            var postObj = { profile_pic }
                            var toUrl = `http://server.reservina.ir/shops/update/${this.props.edit.belongsTo}`;
                            this._uploadImage(postObj, toUrl).then((json) => {
                                this.props.updateShop(json.data);
                                Actions.pop()
                            })
                        }
                    }>
                        <TText>آپلود کردن</TText>
                    </Button>
                </View>
            </ScrollView>
        } else if (this.state.step == 2) {
            return <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 20 }}>

                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                    () => {
                        var profile_pic = {
                            uri: this.state.imageSource.uri,
                            type: 'image/jpeg',
                            name: 'photo.jpg',
                        };

                        var postObj = { profile_pic };
                        var toUrl = `http://server.reservina.ir/shops/update/${this.props.edit.belongsTo}`;
                        this._uploadImage(postObj, toUrl)
                            .then((json) => {
                                this.props.updateShop(json.data);
                                Actions.pop()
                            })
                    }
                }>
                    <TText>آپلود کردن</TText>
                </Button>
            </View>
        }


        return <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 20 }}>

            <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                () => {
                    picker((source, imageData, imageResponse) => {
                        this.setState({ imageSource: source, imageData, imageResponse, step: 1 });
                    })
                }
            }>
                <TText>انتخاب عکس</TText>
            </Button>
        </View>
    }
    renderUserImageOptions() {
        if (this.state.step == 1) {
            return <ScrollView style={{ padding: 20 }}>
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                        () => {
                            ImageCropperPicker.openCropper({
                                path: this.state.imageResponse.uri,
                                width: 3000,
                                height: 3000
                            })
                                .then(image => {
                                    this.setState({ imageSource: { uri: image.path }, imageResponse: image, step: 2 });
                                });
                        }
                    }>
                        <TText>بریدن مربعی</TText>
                    </Button>

                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                        () => {
                            ImageCropperPicker.openCropper({
                                path: this.state.imageResponse.uri,
                                width: 3000,
                                height: 1500
                            })
                                .then(image => {
                                    this.setState({ imageSource: { uri: image.path }, imageResponse: image, step: 2 });
                                });
                        }
                    }>
                        <TText>بریدن مستطیلی</TText>
                    </Button>
                </View>
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                        () => {
                            var profile_pic = {
                                uri: this.state.imageSource.uri,
                                type: 'image/jpeg',
                                name: 'photo.jpg',
                            };
                            var postObj = { profile_pic }
                            var toUrl = `http://server.reservina.ir/users/update`;
                            this._uploadImage(postObj, toUrl).then((json) => {
                                this.props.updateUser(json.data);
                                Actions.pop()
                            })
                        }
                    }>
                        <TText>آپلود کردن</TText>
                    </Button>
                </View>
            </ScrollView>
        } else if (this.state.step == 2) {
            return <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 20 }}>

                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                    () => {
                        var profile_pic = {
                            uri: this.state.imageSource.uri,
                            type: 'image/jpeg',
                            name: 'photo.jpg',
                        };

                        var postObj = { profile_pic };
                        var toUrl = `http://server.reservina.ir/users/update`;
                        this._uploadImage(postObj, toUrl)
                            .then((json) => {
                                this.props.updateUser(json.data);
                                Actions.pop()
                            })
                    }
                }>
                    <TText>آپلود کردن</TText>
                </Button>
            </View>
        }


        return <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 20 }}>

            <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                () => {
                    picker((source, imageData, imageResponse) => {
                        this.setState({ imageSource: source, imageData, imageResponse, step: 1 });
                    })
                }
            }>
                <TText>انتخاب عکس</TText>
            </Button>
        </View>
    }
    _addHourSteps() {
        if (this.state.step == 0) {
            return <ScrollView style={{ width: '100%', padding: 10, paddingTop: 40 }}>
                <TText>
                    روز مورد نظرتان را انتخاب کنید
            </TText>
                <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 10 }}>

                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showDays(1)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showDays(0)}</Col>
                </Grid>
            </ScrollView>;
        } else if (this.state.step == 1) {
            return <ScrollView style={{ width: '100%', padding: 10, paddingTop: 40 }}>
                <TText>
                    ساعت غیبتتان را انتخاب کنید
            </TText>
                <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 10 }}>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showHours(0)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showHours(1)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showHours(2)}</Col>
                </Grid>
            </ScrollView>;
        }
        else if (this.state.step == 2) {
            return <ScrollView style={{ width: '100%', padding: 10, paddingTop: 40 }}>
                <TText>
                    طول غیبتتان را انتخاب کنید
            </TText>
                <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 10 }}>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showAbsentHours(0)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showAbsentHours(1)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._showAbsentHours(2)}</Col>
                </Grid>
            </ScrollView>;
        }
        return false;
    }

    _renderTimeHours() {
        if (this.state.set_time.personnel_work_times != null && this.state.set_time.personnel_work_times != undefined && this.state.set_time.personnel_work_times.length > 0) {
            let day = this.state.set_time.personnel_work_day;
            let flag = false;
            this.state.set_time.personnel_work_times.map(function (time) {
                if (day == time.day || day == null || day > 6) {
                    flag = true;
                }
            })
            if (!flag) {

                return <TText> هیچ ساعت کاری یافت نشد</TText>;
            }
            let that = this;
            return this.state.set_time.personnel_work_times.map(function (time) {
                if (day == time.day || day == null || day > 6) {
                    return <View key={time.id} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TText> </TText>
                            <ShowDay>
                                {time.day}
                            </ShowDay>
                            <TText> </TText>
                            <ShowTime>{time.start_time}</ShowTime>
                            <TText> - </TText>
                            <ShowTime>{time.end_time}</ShowTime>
                        </View>
                        <TouchableOpacity onPress={() => {
                            let toUrl = `http://server.reservina.ir/personnel_work_times/${time.id}`;
                            that._request({}, toUrl, 'DELETE')
                                .then(() => {
                                    that.setState({
                                        step: 0,
                                        set_time: {
                                            personnel_work_times: null
                                        }
                                    })
                                })
                                .catch(() => {
                                    that.setState({
                                        step: 0,
                                        set_time: {
                                            personnel_work_times: null
                                        }
                                    })
                                })
                        }}>
                            <Icon name="ios-close-outline" />
                        </TouchableOpacity>
                    </View>;
                }

            })

        }
        return <TText> هیچ ساعت کاری یافت نشد</TText>;
    }
    _renderServices() {
        if (this.state.personnel_services != null && this.state.personnel_services != undefined && this.state.personnel_services.length > 0) {
            let that = this;
            return this.state.personnel_services.map(function (item) {

                return <View key={item.id} style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TText>{item.service_name} - {item.service_price}</TText>
                    </View>
                    <TouchableOpacity onPress={() => {
                        let toUrl = `http://server.reservina.ir/shop_services/${item.service_id}`;
                        that._request({}, toUrl, 'DELETE')
                            .then(() => {
                                that.setState({
                                    personnel_services: null
                                })
                            })
                            .catch(() => {
                                that.setState({
                                    personnel_services: null
                                })
                            })
                    }}>
                        <Icon name="ios-close-outline" />
                    </TouchableOpacity>
                </View>;


            })

        }
        return <TText> هیچ سرویسی یافت نشد</TText>;
    }
    _renderAddServiceSteps() {
        if (this.state.step == 0) {
            return <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 40 }}>
                <TText>
                    اسم سرویس جدیدتان را وارد کنید
                </TText>
                <Item >
                    <Input
                        style={[{ fontFamily: 'IRANSansMobile', textAlign: 'right', fontSize: 16, paddingLeft: 12 }]}
                        placeholder={'اسم سرویس را وارد کنید'}
                        value={this.state.input}
                        onChangeText={this.changeInput.bind(this)}
                    />

                </Item>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <TText>
                        {this.state.add_service.message}
                    </TText>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} info onPress={
                        () => {
                            if (this.state.input != null && this.state.input.length > 0) {
                                this.setState({

                                    add_service: {
                                        ...this.state.add_service,
                                        service_name: this.state.input,
                                        message: '',
                                    },
                                    step: 1,
                                })
                                this.setState({
                                    input: ''
                                })
                            } else {
                                this.setState({
                                    add_service: {
                                        ...this.state.add_service,
                                        message: 'اسم سرویس اجباری است'
                                    }
                                })
                            }
                        }
                    }>
                        <TText>ثبت و گام بعد</TText>
                    </Button>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <TText>{this.state.error}</TText>
                </View>
            </View>
        } else if (this.state.step == 1) {
            return <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 40 }}>
                <TText>
                    قیمت سرویس جدیدتان را وارد کنید
                </TText>
                <Item >
                    <Input
                        style={[{ fontFamily: 'IRANSansMobile', textAlign: 'right', fontSize: 16, paddingLeft: 12 }]}
                        placeholder={'قیمت سرویس را وارد کنید'}
                        value={this.state.input}
                        onChangeText={this.changeInput.bind(this)}
                    />

                </Item>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <TText>
                        {this.state.add_service.message}
                    </TText>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} info onPress={
                        () => {
                            if (this.state.input != null && this.state.input.length > 0 && this.state.input.match(/^\d+$/) !== null && parseInt(this.state.input) > 1000) {
                                this.setState({
                                    step: 2,
                                    add_service: {
                                        ...this.state.add_service,
                                        service_price: this.state.input,
                                        message: '',
                                    }
                                })
                                this.setState({
                                    input: ''
                                })
                            } else {
                                this.setState({
                                    add_service: {
                                        ...this.state.add_service,
                                        message: 'قیمت سرویس را به صورت صحیح وارد کنید'
                                    }
                                })
                            }
                        }
                    }>
                        <TText>ثبت و گام بعد</TText>
                    </Button>
                </View>
            </View>
        } else if (this.state.step == 2) {
            return <ScrollView style={{ width: '100%', padding: 10, paddingTop: 40 }}>

                <TText>
                    طول زمان انجام سرویس را وارد کنید
                </TText>
                <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: 40, paddingTop: 10, paddingBottom: 60 }}>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._lengthTime(0)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._lengthTime(1)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._lengthTime(2)}</Col>
                </Grid>
            </ScrollView>
        } else if (this.state.step == 3) {
            return <ScrollView style={{ padding: 20 }}>
                <TText> {this.state.add_service.service_name} - طول سرویس {this.state.add_service.time_length} و قیمت {this._numberWithCommas(this.state.add_service.service_price)}</TText>

                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={() => {
                        let toUrl = `http://server.reservina.ir/shop_services?length_time=${this.state.add_service.time_length}&service_price=${this.state.add_service.service_price}&service_name=${this.state.add_service.service_name}&personnel_id=${this.props.user.personnel_id}`;
                        this._request({}, toUrl, 'POST')
                            .then((res) => {
                                this.setState({
                                    add_service: {
                                        ...this.state.add_service,
                                        message: res.result_message
                                    }
                                })
                            })
                            .catch((res) => {
                                this.setState({
                                    add_service: {
                                        ...this.state.add_service,
                                        message: res.result_message
                                    }
                                })
                            })
                        this.setState({
                            step: 4,
                        })
                    }}>
                        <TText>تایید</TText>
                    </Button>

                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info
                        onPress={() => {
                            this.setState({
                                step: 0,
                                add_service: {
                                    service_name: null,
                                    service_price: null,
                                    message: null,
                                },
                            })
                        }}>
                        <TText>کنسل</TText>
                    </Button>
                </View>
            </ScrollView>;
        } else if (this.state.step == 4) {
            return <ScrollView style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TText> {this.state.add_service.service_name} - طول سرویس {this.state.add_service.time_length} و قیمت {this._numberWithCommas(this.state.add_service.service_price)}</TText>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TText>{this.state.add_service.message} </TText>
                </View>
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>



                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info
                        onPress={() => {
                            this.setState({
                                step: 0,
                                add_service: {
                                    service_name: null,
                                    service_price: null,
                                    message: null,
                                },
                            })
                        }}>
                        <TText>باشه</TText>
                    </Button>
                </View>
            </ScrollView>
        }

        return false;
    }

    _numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    _renderSetTimeSteps() {
        if (this.state.step == 0) {
            return <ScrollView style={{ width: '100%', padding: 10, paddingTop: 40 }}>
                <View style={{ height: 50, marginBottom: 20 }}>
                    <ScrollView style={{ width: '100%', paddingRight: 10, paddingLeft: 10, }}>
                        {this._renderTimeHours()}
                    </ScrollView>
                </View>
                <TText>
                    روز مورد نظرتان را انتخاب کنید
            </TText>
                <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 10 }}>
                    <Row>
                        <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Row style={{ height: 40 }}>
                                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                    this.setState({
                                        step: 1,
                                        set_time: {
                                            ...this.state.set_time,
                                            personnel_work_day: 0,
                                        }
                                    });
                                }}>
                                    <TText style={[{ color: '#333' }]}> شنبه </TText>
                                </Button>
                            </Row>
                            <Row style={{ height: 40 }}>
                                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                    this.setState({
                                        step: 1,
                                        set_time: {
                                            ...this.state.set_time,
                                            personnel_work_day: 3,
                                        }
                                    });
                                }}>
                                    <TText style={[{ color: '#333' }]}> سه شنبه </TText>
                                </Button>
                            </Row>
                        </Col>
                        <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Row style={{ height: 40 }}>
                                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                    this.setState({
                                        step: 1,
                                        set_time: {
                                            ...this.state.set_time,
                                            personnel_work_day: 1,
                                        }
                                    });
                                }}>
                                    <TText style={[{ color: '#333' }]}> یکشنبه </TText>
                                </Button>
                            </Row>
                            <Row style={{ height: 40 }}>
                                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                    this.setState({
                                        step: 1,
                                        set_time: {
                                            ...this.state.set_time,
                                            personnel_work_day: 4,
                                        }
                                    });
                                }}>
                                    <TText style={[{ color: '#333' }]}> چهارشنبه </TText>
                                </Button>
                            </Row>
                        </Col>
                        <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Row style={{ height: 40 }}>
                                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                    this.setState({
                                        step: 1,
                                        set_time: {
                                            ...this.state.set_time,
                                            personnel_work_day: 2,
                                        }
                                    });
                                }}>
                                    <TText style={[{ color: '#333' }]}> دوشنبه </TText>
                                </Button>
                            </Row>
                            <Row style={{ height: 40 }}>
                                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                    this.setState({
                                        step: 1,
                                        set_time: {
                                            ...this.state.set_time,
                                            personnel_work_day: 5,
                                        }
                                    });
                                }}>
                                    <TText style={[{ color: '#333' }]}> پنجشنبه </TText>
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Row style={{ height: 40 }}>
                                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                    this.setState({
                                        step: 1,
                                        set_time: {
                                            ...this.state.set_time,
                                            personnel_work_day: 6,
                                        }
                                    });
                                }}>
                                    <TText style={[{ color: '#333' }]}> جمعه </TText>
                                </Button>
                            </Row>
                        </Col>
                        <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Row style={{ height: 40 }}>
                                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                    this.setState({
                                        step: 1,
                                        set_time: {
                                            ...this.state.set_time,
                                            personnel_work_day: 7,
                                        }
                                    });
                                }}>
                                    <TText style={[{ color: '#333' }]}> به جز جمعه </TText>
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Row style={{ height: 40 }}>
                                <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                    this.setState({
                                        
                                        step: 1,
                                        set_time: {
                                            ...this.state.set_time,
                                            personnel_work_day: 8,
                                        }
                                    });
                                }}>
                                    <TText style={[{ color: '#333' }]}> به جز پنجشنبه و جمعه </TText>
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </ScrollView>;
        } else if (this.state.step == 1) {
            return <ScrollView style={{ width: '100%', padding: 10, paddingTop: 40 }}>
                <View style={{ height: 50, marginBottom: 20 }}>
                    <ScrollView style={{ width: '100%', paddingRight: 10, paddingLeft: 10, }}>
                        {this._renderTimeHours()}
                    </ScrollView>
                </View>
                <ShowDay>
                    {this.state.set_time.personnel_work_day}
                </ShowDay>
                <TText>
                    ساعت ورود روز خود را انتخاب کنید
                </TText>
                <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 60 }}>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._enterHours(0)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._enterHours(1)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._enterHours(2)}</Col>
                </Grid>
            </ScrollView>;
        }
        else if (this.state.step == 2) {
            return <ScrollView style={{ width: '100%', padding: 10, paddingTop: 40 }}>
                <View style={{ height: 50, marginBottom: 20 }}>
                    <ScrollView style={{ width: '100%', paddingRight: 10, paddingLeft: 10, }}>
                        {this._renderTimeHours()}
                    </ScrollView>
                </View>
                <ShowDay>
                    {this.state.set_time.personnel_work_day}
                </ShowDay>
                <TText>
                    ساعت خروج خود را انتخاب کنید
                </TText>
                <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 60 }}>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._exitHours(0)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._exitHours(1)}</Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>{this._exitHours(2)}</Col>
                </Grid>
            </ScrollView>;
        }
        else if (this.state.step == 3) {
            return <ScrollView style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TText> </TText>
                    <ShowDay>
                        {this.state.set_time.personnel_work_day}
                    </ShowDay>
                    <TText> </TText>
                    <ShowTime>{this.state.set_time.start_time}</ShowTime>
                    <TText> - </TText>
                    <ShowTime>{this.state.set_time.end_time}</ShowTime>
                </View>
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={() => {
                        let toUrl = `http://server.reservina.ir/personnel_work_times?start_time=${this.state.set_time.start_time}&end_time=${this.state.set_time.end_time}&day=${this.state.set_time.personnel_work_day}&personnel_id=${this.props.user.personnel_id}`;
                        this._request({}, toUrl, 'POST')
                            .then((res) => {
                                this.setState({
                                    set_time: {
                                        ...this.state.set_time,
                                        message: res.result_message
                                    }
                                })
                            })
                            .catch((res) => {
                                this.setState({
                                    set_time: {
                                        ...this.state.set_time,
                                        message: res.result_message
                                    }
                                })
                            })
                        this.setState({
                            step: 4,
                        })
                    }}>
                        <TText>تایید</TText>
                    </Button>

                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info
                        onPress={() => {
                            this.setState({
                                step: 0,
                                set_time: {
                                    personnel_work_times: null
                                }
                            })
                        }}>
                        <TText>کنسل</TText>
                    </Button>
                </View>
            </ScrollView>;
        } else if (this.state.step == 4) {
            return <ScrollView style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TText> </TText>
                    <ShowDay>
                        {this.state.set_time.personnel_work_day}
                    </ShowDay>
                    <TText> </TText>
                    <ShowTime>{this.state.set_time.start_time}</ShowTime>
                    <TText> - </TText>
                    <ShowTime>{this.state.set_time.end_time}</ShowTime>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TText>{this.state.set_time.message} </TText>
                </View>
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>



                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info
                        onPress={() => {
                            this.setState({
                                step: 0,
                                set_time: {
                                    personnel_work_times: null
                                }
                            })
                        }}>
                        <TText>باشه</TText>
                    </Button>
                </View>
            </ScrollView>
        }

        return false;
    }
    async _getPersonnelFreeDays(personnel_id) {
        try {
            let response = await fetch(`http://server.reservina.ir/personnel_free_days?personnel_id=${personnel_id}&time_length=00:30`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            let json = await response.json();
            return json.data;
        } catch (error) {
            console.log(error);
        }
    }

    async _getPersonnelFreeHours(personnel_id, date) {
        try {
            let response = await fetch(`http://server.reservina.ir/personnel_free_hours?personnel_id=${personnel_id}&time_length=00:30&date=${date}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            let json = await response.json();
            return json.data;
        } catch (error) {
            console.log(error);
        }
    }
    _renderAddHour(title) {
        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>{title}</TH2>

            {this._addHourSteps()}

        </View>
    }
    postAddMoney(amount){
        this._postAddMoneyRequest(amount)
        .then((json) => {
            Linking.openURL(json.url)
        })
    }
    async _postAddMoneyRequest(amount){
        try {
            let response = await fetch(`http://server.reservina.ir/add_money?amount=${amount}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.user.apiToken}`
                }
            });
            let json = await response.json();
            return json.data;
        } catch (error) {
            console.log(error);
        }
    }
    _renderAddMoney(title) {
        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>{title}</TH2>

            <ScrollView style={{ width: '100%', padding: 10, paddingTop: 40 }}>
                <TText>
                    مبلغ مورد نظرتان را انتخاب کنید
            </TText>
                <Grid style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 10 }}>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Row style={{ height: 40 }}>
                            <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                this.postAddMoney(10000)
                                this.setState({
                                    message: 'بعد از پرداخت اعتبار شما افزایش خواهد یافت'
                                })
                            }}
                            >
                                <TText style={[{ color: '#333' }]}>10 هزار تومان</TText>
                            </Button>
                        </Row>
                        <Row style={{ height: 40 }}>
                            <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                this.postAddMoney(100000)
                                this.setState({
                                    message: 'بعد از پرداخت اعتبار شما افزایش خواهد یافت'
                                })
                            }}
                            >
                                <TText style={[{ color: '#333' }]}>100 هزار تومان</TText>
                            </Button>
                        </Row>
                    </Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Row style={{ height: 40 }}>
                            <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                this.postAddMoney(20000)
                                this.setState({
                                    message: 'بعد از پرداخت اعتبار شما افزایش خواهد یافت'
                                })
                            }}
                            >
                                <TText style={[{ color: '#333' }]}>20 هزار تومان</TText>
                            </Button>
                        </Row>
                        <Row style={{ height: 40 }}>
                            <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                this.postAddMoney(200000)
                                this.setState({
                                    message: 'بعد از پرداخت اعتبار شما افزایش خواهد یافت'
                                })
                            }}
                            >
                                <TText style={[{ color: '#333' }]}>200 هزار تومان</TText>
                            </Button>
                        </Row>
                    </Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Row style={{ height: 40 }}>
                            <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                this.postAddMoney(50000)
                                this.setState({
                                    message: 'بعد از پرداخت اعتبار شما افزایش خواهد یافت'
                                })
                            }}
                            >
                                <TText style={[{ color: '#333' }]}>50 هزار تومان</TText>
                            </Button>
                        </Row>
                        <Row style={{ height: 40 }}>
                            <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                                this.postAddMoney(500000)
                                this.setState({
                                    message: 'بعد از پرداخت اعتبار شما افزایش خواهد یافت'
                                })
                            }}
                            >
                                <TText style={[{ color: '#333' }]}>500 هزار تومان</TText>
                            </Button>
                        </Row>
                    </Col>
                </Grid>
            </ScrollView>

        </View>
    }
    _renderSetTime(title) {
        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>{title}</TH2>
            {this._renderSetTimeSteps()}
        </View>
    }
    _renderShowServices(title) {
        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>{title}</TH2>
            <ScrollView style={{ width: '100%', padding: 10, paddingTop: 40 }}>
                <View style={{ marginBottom: 20 }}>
                    <ScrollView style={{ width: '100%', paddingRight: 10, paddingLeft: 10, }}>
                        {this._renderServices()}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    }
    _renderAddService(title) {
        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>{title}</TH2>


            {this._renderAddServiceSteps()}



        </View>
    }
    _showDays(part) {

        if (this.state.personnel_free_days != null && this.state.personnel_free_days.length > 0) {
            return this.state.personnel_free_days.map(function (day, index) {
                if (index % 2 == part)
                    return false;
                return <Row key={day.date} style={{ height: 40 }}>
                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger
                        onPress={() => {
                            this.setState({

                                step: 1,
                                fake_reserve: {
                                    ...this.state.fake_reserve,
                                    date: day.date,
                                    show_date: day.show_date,
                                }
                            });
                            this._getPersonnelFreeHours(this.props.user.personnel_id, day.date).then((res) => {
                                this.setState({

                                    step: 1,
                                    fake_reserve: {
                                        ...this.state.fake_reserve,
                                        free_hours: res,
                                    }
                                })
                            })
                        }}
                    >
                        <TText style={[{ color: '#333' }]}> {day.show_date}</TText>
                    </Button>
                </Row>
            }.bind(this));
        }
        if (part % 2 == 1)
            return <Spinner color='#BFBFBF' />;
        return false;

    }
    _enterHours(part) {

        if (this.state.enter_hours != null && this.state.enter_hours.length > 0) {
            return this.state.enter_hours.map(function (hours, index) {
                if (index % 3 == part) {
                    return <Row key={hours.hour} style={{ height: 40 }}>
                        <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                            this.setState({
                                step: 2,
                                set_time: {
                                    ...this.state.set_time,
                                    start_time: hours.hour
                                }
                            });
                        }}
                        >
                            <TText style={[{ color: '#333' }]}> {hours.hour}</TText>
                        </Button>
                    </Row>
                }
                return false;

            }.bind(this));
        }

        if (part % 3 == 1)
            return <Spinner color='#BFBFBF' />;
        return false;
    }
    _lengthTime(part) {

        if (this.state.time_length != null && this.state.time_length.length > 0) {
            return this.state.time_length.map(function (hours, index) {
                if (index % 3 == part) {
                    return <Row key={hours.hour} style={{ height: 40 }}>
                        <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                            this.setState({
                                step: 3,
                                add_service: {
                                    ...this.state.add_service,
                                    time_length: hours.hour
                                }
                            });
                        }}
                        >
                            <TText style={[{ color: '#333' }]}> {hours.hour}</TText>
                        </Button>
                    </Row>
                }
                return false;

            }.bind(this));
        }

        if (part % 3 == 1)
            return <Spinner color='#BFBFBF' />;
        return false;
    }
    _exitHours(part) {

        if (this.state.exit_hours != null && this.state.exit_hours.length > 0) {
            return this.state.exit_hours.map(function (hours, index) {
                if (index % 3 == part) {
                    return <Row key={hours.hour} style={{ height: 40 }}>
                        <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                            this.setState({
                                step: 3,
                                set_time: {
                                    ...this.state.set_time,
                                    end_time: hours.hour
                                }
                            });
                        }}
                        >
                            <TText style={[{ color: '#333' }]}> {hours.hour}</TText>
                        </Button>
                    </Row>
                }
                return false;

            }.bind(this));
        }

        if (part % 3 == 1)
            return <Spinner color='#BFBFBF' />;
        return false;
    }
    _showHours(part) {

        if (this.state.fake_reserve.free_hours != null && this.state.fake_reserve.free_hours.length > 0) {
            return this.state.fake_reserve.free_hours.map(function (hours, index) {
                if (index % 3 == part) {
                    return <Row key={hours.hour} style={{ height: 40 }}>
                        <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                            this.setState({

                                step: 2,
                                fake_reserve: {
                                    ...this.state.fake_reserve,
                                    start_time: hours.hour
                                }
                            });
                        }}
                        >
                            <TText style={[{ color: '#333' }]}> {hours.hour}</TText>
                        </Button>
                    </Row>
                }
                return false;

            }.bind(this));
        }

        if (part % 3 == 1)
            return <Spinner color='#BFBFBF' />;
        return false;
    }
    _showAbsentHours(part) {

        if (this.state.fake_reserve.absentHours != null && this.state.fake_reserve.absentHours.length > 0) {
            return this.state.fake_reserve.absentHours.map(function (hours, index) {
                if (index % 3 == part) {
                    return <Row key={hours.hour} style={{ height: 40 }}>
                        <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} full bordered rounded danger onPress={() => {
                            this.setState({

                                step: 3,
                                fake_reserve: {
                                    ...this.state.fake_reserve,
                                    abset_length: hours.hour
                                }
                            });


                            toUrl = `http://server.reservina.ir/fake_reserve?personnel_id=${this.props.user.personnel_id}&start_time=${this.state.fake_reserve.start_time}&time_length=${hours.hour}&date=${this.state.fake_reserve.date}`;

                            this._request({}, toUrl, "GET").then(() => {
                                Actions.pop();
                            })
                        }}
                        >
                            <TText style={[{ color: '#333' }]}> {hours.hour}</TText>
                        </Button>
                    </Row>
                }
                return false;

            }.bind(this));
        }

        if (part % 3 == 1)
            return <Spinner color='#BFBFBF' />;
        return false;
    }

    _renderSelectPicture(title) {

        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>{title}</TH2>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 40 }}>


                {this.renderImageSelected(this.state.imageSource, this.state.imageResponse)}
                {this.renderImageOptions()}

            </View>
        </View>

    }
    _renderUserSelectPicture(title) {

        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>{title}</TH2>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 40 }}>


                {this.renderImageSelected(this.state.imageSource, this.state.imageResponse)}
                {this.renderUserImageOptions()}

            </View>
        </View>

    }
    _renderYNQuestion(title, question = 'آیا مطمئن هستید؟') {
        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>{title}</TH2>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 40 }}>

                <TText>{question}</TText>


                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                        () => {
                            this._handleRequest();
                        }
                    }>
                        <TText>بله</TText>
                    </Button>
                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10, margin: 5 }} info onPress={
                        () => {
                            Actions.pop();
                        }
                    }>
                        <TText>خیر</TText>
                    </Button>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <TText>{this.state.error}</TText>
                </View>
            </View>
        </View>

    }
    _renderTTextEdit(title, inputPlaceHolder = 'متن را وارد کنید', buttonTText = 'ثبت') {
        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>{title}</TH2>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 40 }}>
                <Item >
                    <Input
                        style={[{ fontFamily: 'IRANSansMobile', textAlign: 'right', fontSize: 16, paddingLeft: 12 }]}
                        placeholder={inputPlaceHolder}
                        value={this.state.input}
                        onChangeText={this.changeInput.bind(this)}
                    />

                </Item>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Button style={{ padding: 1, paddingRight: 10, paddingLeft: 10 }} info onPress={
                        () => {
                            this._handleRequest();
                        }
                    }>
                        <TText>{buttonTText}</TText>
                    </Button>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <TText>{this.state.error}</TText>
                </View>
            </View>
        </View>

    }

    _renderFinalStep() {


        return <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
            <TH2>پایان عملیات</TH2>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 40 }}>

                <TText>{this.state.message}</TText>

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

    render() {
        return (
            <BaseLightbox verticalPercent={0.8} horizontalPercent={0.6}>

                {this._renderSteps()}

            </BaseLightbox>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateShop: shop => {
            dispatch(updateShop(shop))
        },
        updateUser: shop => {
            dispatch(updateUser(shop))
        },
        deleteShopPersonnel: id => {
            dispatch(deleteShopPersonnel(id))
        }
    }
}

const mapStateToProps = (state) => {
    return {
        shop: state.shop,
        user: state.user,
        edit: state.edit,
        reserveInfo: state.reserveInfo
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditLightbox)