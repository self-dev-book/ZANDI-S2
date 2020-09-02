import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Button, Image, Text, View, Alert } from 'react-native';
import ReactNativeSettingsPage, { 
	SectionRow, 
	NavigateRow,
	CheckRow
} from 'react-native-settings-page';

import  {loadGitHubToken, deleteGitHubToken } from './GitHubLogin.js';

import {getUserInfo} from '../util/GitHubAPI.js'
import styles from '../styles/style';


class Settings extends React.Component {
	state = {
		check: false,
		switch: false,
		value: 40
	}
	//account = getUserInfo(loadGitHubToken)
	//스트링 형태가 아니라서 안된대 왜지?

	account={
		name: "gyuZzang",
		email: "tndnd0606@gmail.com",
		avatar: 'https://avatars3.githubusercontent.com/u/43772472?s=60&v=4'
	}
	
	_navigateToScreen = () => {
		const { navigation } = this.props
		navigation.navigate('Alarm');
	}
	
	render() {
		return (
			<ReactNativeSettingsPage>
				<SectionRow text="github account" >
					<View style={styles_p.profile_box}>
						<View style={styles_p.profile_img}>
							<Image
								style={{
								padding: 10,
								width: 75,
								height: 75,
								borderRadius: 90
								}}
								resizeMode='cover'
								source={{uri:this.account.avatar}}
							/>
						</View>
						<View style={styles_p.text_box}>
							<Text style={styles_p.name}>{this.account.name}</Text>
							<Text style={styles_p.mail}>{this.account.email}</Text>
						</View>
					</View>
				</SectionRow>
				<SectionRow >
					<NavigateRow
						text='알람 설정'
						iconName='bell'
						onPressCallback={this._navigateToScreen} />				
					<NavigateRow
						text='로그아웃'
						iconName='user-times'
						onPressCallback={()=> Alert.alert('logout','로그아웃하시겠습니까?',[
							{text: 'OK', onPressCallback:()=>deleteGitHubToken()},
						])} />
				</SectionRow>
			</ReactNativeSettingsPage>
		)
	}
}

let styles_p = StyleSheet.create({
	profile_box: {
		flex:1,
		flexDirection:"row"
	  //width: null,
	  //height: null,
	  //resizeMode: 'cover', // or 'stretch'
	},
	text_box:{
		padding:3,
		flex:4
	},
	name: {
	  textAlign: 'center',
	  fontSize: 24
	},
	mail:{
		textAlign: 'center',
		fontSize: 15,
		color: 'grey',
		margin: 15
	},
	profile_img:{
		flex:1,
		margin:10,
		marginLeft:40,
		alignItems:'center'
	}  

  });
  

export default Settings

// export default () => {
//   return (
//     <View style={styles.container}>
//       <Text>This is the Setting</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// };
