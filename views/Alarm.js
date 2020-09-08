import { StatusBar } from 'expo-status-bar';
import React , { useState }from 'react';
import { StyleSheet, Button, Image, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeSettingsPage, {
    SectionRow,
    NavigateRow,
    SliderRow ,
    SwitchRow,
    CheckRow
} from 'react-native-settings-page';

import styles from '../styles/style';
//import { sendPushNotification } from '../App'
// const period = [
//     {
//         label: '1일',
//         value: '1day',
//     },
//     {
//         label: '2일',
//         value: '2day',
//     },
//     {
//         label: '3일',
//         value: '3day',
//     },
//     {
//         label: '4일',
//         value: '4day',
//     },
//     {
//         label: '5일',
//         value: '5day',
//     },
//     {
//         label: '6일',
//         value: '6day',
//     },
//     {
//         label: '7일',
//         value: '7day',
//     }
// ];

async function sendPushNotification(expoPushToken, count) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: '잔디 쑥쑥',
      body: `커밋한 지 ${count}일 째! 잔디를 키워주세요 :)`,
      data: { data: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

class Alarm extends React.Component {

    onPress_plus = () => {
        if(this.state.count<7)
        this.setState({count:this.state.count+1} );
        this.push_notification()
    }
    onPress_minus = () => {
        if(this.state.count>1)
        this.setState({count:this.state.count-1} )
        this.push_notification()
    }
    push_notification = () => {
        if(this.props.dayAfterCommit==this.state.count){
            sendPushNotification(this.props.expoPushToken, this.state.count)
        }
    }
    state = {
        count :1,
        check: false,
        switch_alarm: false,
        switch_sound: false,
        switch_vibe: false,
        switch_push: false
    }


    render() {
        return (
            <ReactNativeSettingsPage>
                <SwitchRow
                    text='알람'
                    _value={this.state.switch_alarm}
                    _onValueChange={() => {
                        this.setState({
                            switch_alarm: !this.state.switch_alarm,
                            switch_sound: !this.state.switch_alarm,
                            switch_vibe: !this.state.switch_alarm,
                            switch_push: !this.state.switch_alarm
                        })
                    }}
                />
                {this.state.switch_alarm ?
                    (
                        <>
                                <SwitchRow
                                    text='소리'
                                    _value={this.state.switch_sound}
                                    _onValueChange={() => { this.setState({ switch_sound: !this.state.switch_sound }) }} />
                                <SwitchRow
                                    text='진동'
                                    _value={this.state.switch_vibe}
                                    _onValueChange={() => { this.setState({ switch_vibe: !this.state.switch_vibe }) }} />
                                <SwitchRow
                                    text='푸시알림'
                                    _value={this.state.switch_push}
                                    _onValueChange={() => { this.setState({ switch_push: !this.state.switch_push }) }} />

                            <SectionRow text="알람주기 설정">
                                <View style={opacityStyles.container}>
                                    <TouchableOpacity
                                        style={opacityStyles.button}
                                        onPress={this.onPress_minus}
                                    >
                                        <Text style={opacityStyles.buttonText}>-</Text>
                                    </TouchableOpacity>
                                    <View style={opacityStyles.countContainer}>
                                        <Text style={opacityStyles.countText}>{this.state.count} day</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={opacityStyles.button}
                                        onPress={this.onPress_plus}
                                    >
                                        <Text style={opacityStyles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>

                            </SectionRow>


                        </>
                    ) :
                    (
                        <></>

                    )}

            </ReactNativeSettingsPage>
        )
    }
}

const opacityStyles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        margin:5
        
    },
    button:{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        borderRadius: 40,
        height: 40,
        width: 40
    },
    countContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText:{
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 15
    },
    buttonText:{
        fontSize: 15
    }
})


export default Alarm    