import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Button, Image, Text, View } from 'react-native';
import ReactNativeSettingsPage, {
    SectionRow,
    NavigateRow,
    SwitchRow,
    CheckRow
} from 'react-native-settings-page';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';

import styles from '../styles/style';

const period = [
    {
        label: '1일',
        value: '1day',
    },
    {
        label: '2일',
        value: '2day',
    },
    {
        label: '3일',
        value: '3day',
    },
    {
        label: '4일',
        value: '4day',
    },
    {
        label: '5일',
        value: '5day',
    },
    {
        label: '6일',
        value: '6day',
    },
    {
        label: '7일',
        value: '7day',
    }
];


class Alarm extends React.Component {
    constructor(props){
        super(props);
    
    this.state = {
        check: false,
        switch_alarm: false,
        switch_sound: false,
        switch_vibe: false,
        switch_push: false,
        alarm_period: undefined,

    }

    this.inputRefs = {
        alarm_period: null,

    }

    
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
                            <SectionRow>
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
                            </SectionRow>
                            <SectionRow
                                text="알람 주기" >
                                <View paddingVertical={5} />
                                <RNPickerSelect
                                    placeholder={{
                                        label: '알람 주기를 선택하세요'
                                    }}
                                    items={period}
                                    onValueChange={value => {
                                        this.setState({
                                            alarm_period: value
                                        });
                                    }}

                                    /*
                                    onUpArrow={() => {
                                        this.inputRefs.firstTextInput.focus();
                                    }}
                                    onDownArrow={() => {
                                        this.inputRefs.tmp.togglePicker();
                                    }}
                                    */
                                    style={pickerSelectStyles}
                                    value={this.state.alarm_period}
                                    useNativeAndroidPickerStyle={false}
                                    ref={el => {
                                        this.inputRefs.alarm_period = el;
                                    }}
                                />
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


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default Alarm    