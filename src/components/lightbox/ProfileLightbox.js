import React from 'react';
import { Animated, View , TouchableOpacity } from 'react-native';
import { Button, Icon, Text, H2} from 'native-base';
import BaseLightbox from "./BaseLightbox";


export default class ProfileLightbox extends React.Component {


    render() {
        return (
            <BaseLightbox verticalPercent={0.7} horizontalPercent={0.5}>
                
                <View style={{width:'100%',justifyContent:'flex-start',alignItems:'center' , padding: 10}}>
                    <H2>انتخاب تصویر</H2>
                    <View style={{width:'100%',justifyContent:'center',alignItems:'center' , padding: 10}}>
                    <TouchableOpacity style={{width:'50%',height:40, borderColor:'red',borderWidth:1,backgroundColor:'white',justifyContent:'center',alignItems:'center', borderRadius:8,marginTop:50}}>
                        <Text>گالری</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:'50%',height:40, borderColor:'red',borderWidth:1,backgroundColor:'white',justifyContent:'center',alignItems:'center', borderRadius:8,marginTop:10}}>                          
                        <Text>دوربین</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </BaseLightbox>
        )
    }
}