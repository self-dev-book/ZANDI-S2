import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Button } from 'native-base';
import ReactNativeSettingsPage, {
	SectionRow,
	NavigateRow,
	CheckRow
} from 'react-native-settings-page';

import { NavigationActions } from 'react-navigation';

import Icon from 'react-native-vector-icons/Ionicons';

var images = [
	require('../assets/zandi.png'),
]

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flex:2, justifyContent: 'flex-end', flexDirection: 'row'}}>
            <Icon name="ios-notifications" size={30} color="black" />
						<Icon name="ios-settings" size={30} color="black" style={{paddingRight:20, paddingLeft:20}} onPress={() => navigation.navigate('Setting')} />
          </View>
          <StatusBar style="auto" />
        </View>
				<View style={styles.commit}>
					<View style={{flexDirection:'row', justifyContent:'space-around'}}>
						<View style={{alignItems:'center'}}>
							<Text style={{fontSize:17, fontWeight:'bold'}}>5</Text>
							<Text style={{fontSize:12, color:'gray', textAlign: 'center'}}>week</Text>
						</View>
						<View style={{alignItems:'center'}}>
							<Text style={{fontSize:17, fontWeight:'bold'}}>18</Text>
							<Text style={{fontSize:12, color:'gray'}}>month</Text>
						</View>
							<View style={{alignItems:'center'}}>
							<Text style={{fontSize:17, fontWeight:'bold'}}>192</Text>
							<Text style={{fontSize:12, color:'gray'}}>year</Text>
						</View>
					</View>
				</View>
				<View style={styles.announcement} >
					<Text style={{fontSize: 20, textAlign: 'center', lineHeight: 50,}}>
						마지막으로 commit한지 {"\n"}__일 지났습니다
					</Text>
				</View>
				<View style={styles.character}>
					<Image
						source={require('../assets/zandi_nobackground.png')} style={{width:150, hegiht:50, resizeMode:'contain'}}
					/>
				</View>
				<View style={styles.bottom}>
				<Text>(슬라이드 화면전환)</Text>
				</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		alignItems: 'center',
    backgroundColor: '#fff',
  },
	header: {
		flex:1,
    justifyContent: 'flex-start',
		backgroundColor: '#acd99d',
    height: 55,
    flexDirection: 'row',
    paddingTop: 15,
		paddingBottom: 10
  },
	commit: {
		flex:2,
		justifyContent: 'center',
	},
	announcement: {
		flex:5,
		justifyContent: 'center',
		//fontsize: 20,
	},
	character: {
		flex:7,
		justifyContent: 'center',
	},
	bottom: {
		flex:3,
		justifyContent: 'center',
	}
})
