import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Button, Image, Text, View } from 'react-native';
import ReactNativeSettingsPage, { 
	SectionRow, 
	NavigateRow,
	CheckRow
} from 'react-native-settings-page';
import {deleteGitHubToken } from './GitHubLogin.js';

import styles from '../styles/style';


class Settings extends React.Component {
	// TODO: implement your navigationOptions
	state = {
		check: false,
		switch: false,
		value: 40
	}

	account={
		name: "gyuZzang",
		email: "tndnd0606@gmail.com"
	}
	
	_navigateToScreen = () => {
		const { navigation } = this.props
		navigation.navigate('Alarm');
	}
	
	logout=()=>{
		deleteGitHubToken();
	}
	render() {
		return (
			<ReactNativeSettingsPage>
				<SectionRow text="github account" >
					<View style={styles_p.profile_box}>
						<View style={styles_p.profile_txt}>
							<Image
								style={styles.tinyLogo}
								source={{uri:"https://avatars3.githubusercontent.com/u/43772472?s=60&v=4",}}
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
						onPressCallback={this.logout} />
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
	profile_txt:{
		flex:1,
		textAlignVertical:'center',
		textAlign:'center'
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
