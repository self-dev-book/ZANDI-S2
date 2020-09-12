import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Image, Button } from 'react-native';
import ReactNativeSettingsPage, {
	SectionRow,
	NavigateRow,
	CheckRow
} from 'react-native-settings-page';

import Swiper from 'react-native-swiper'; //슬라이드 화면전환

import Icon from 'react-native-vector-icons/Ionicons'; //아이콘 삽입

var images = [
	require('../assets/zandi.png'),
]

export default class App extends React.Component {

	makeTile(commit_count) {
		const backGroundColors = [
			[13, "#143601"],
			[ 8, "#1a4301"],
			[ 5, "#245501"],
			[ 3, "#538d22"],
			[ 2, "#73a942"],
			[ 1, "#aad576"],
			[ 0, "#F0F0F0"]
		];

		for (let i = 0; i < backGroundColors.length; i++) {
			if (commit_count >= backGroundColors[i][0]) {
				return (
					<View
						style={[
							{
								flex: 1,
								width: '100%',
								aspectRatio: 1,
								borderRadius: 6,
								margin: 8
							},
							{ backgroundColor: backGroundColors[i][1] }
						]}
					/>
				);
			}
		}
	}

	makeRow(count_row) {
		// counts should be 1 * 5 matrix
		return (
			<View style={{ flexDirection: 'row' }}>
				{
					count_row.map((value, index) => this.makeTile(value))
				}
			</View>
		);
	}

	makeTable(count_matrix) {
		// counts should be 7 * 5 matrix
		return (
			<View style={{ width: '64%' }}>
				{
					count_matrix.map((count_row, index) => this.makeRow(count_row))
				}
			</View>
		);
	}


	render() {
		return (
			<View style={styles.container}>
				<StatusBar style="auto" />
				<View style={styles.header}>
					<View style={{flex:2, justifyContent: 'flex-end', flexDirection: 'row'}}>
						<Icon name="ios-notifications" size={30} color="black" />
						<Icon name="ios-settings" size={30} color="black" style={{paddingRight:20, paddingLeft:20}} onPress={() => this.props.navigation.navigate('Setting')} />
					</View>
				</View>

				<Swiper style={styles.wrapper} showButtons={true}>
					<View style={styles.slide1}>
						<View style={styles.commit}>
							<View style={{flexDirection:'row', justifyContent:'space-around'}}>

								<View style={{alignItems:'center', paddingHorizontal: 10}}>
									<Text style={{fontSize:17, fontWeight:'bold'}}>5</Text>
									<Text style={{fontSize:12, color:'gray', textAlign: 'center'}}>week</Text>
								</View>

								<View style={{alignItems:'center', paddingHorizontal: 10}}>
									<Text style={{fontSize:17, fontWeight:'bold'}}>18</Text>
									<Text style={{fontSize:12, color:'gray'}}>month</Text>
								</View>

								<View style={{alignItems:'center', paddingHorizontal: 10}}>
									<Text style={{fontSize:17, fontWeight:'bold'}}>192</Text>
									<Text style={{fontSize:12, color:'gray'}}>year</Text>
								</View>

							</View>
						</View>

						<View style={styles.announcement} >
							<Text style={{fontSize: 20, textAlign: 'center', lineHeight: 50,}}>
								마지막으로 물을 준 지 {"\n"}__ 일 지났습니다
							</Text>
						</View>

						<View style={styles.character}>
							<Image
								source={require('../assets/zandi_zeze.jpg')} style={{width:200, height:200, resizeMode:'contain'}}
							/>

						</View>
					</View>

					<View style={styles.slide2}>
						{
							this.makeTable([
								[0, 1, 2, 3, 4],
								[7, 1, 2, 3, 4],
								[0, 17, 2, 5, 8],
								[10, 1, 2, 3, 4],
								[10, 8, 2, 3, 4],
								[0, 8, 6, 3, 4],
								[10, 8, 6, 3, 4]
							])
						}
					</View>

				</Swiper>

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
		//flex:1,
		//justifyContent: 'flex-start',
		backgroundColor: '#fff',
		height: 60,
		width: '100%',
		//flexDirection: 'row',
		paddingTop: 25,
		paddingBottom: 3
		
	},
	slide1: {
		flex:1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	slide2: {
		flex:1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	commit: {
		flex:3,
		justifyContent: 'flex-end',
	},
	announcement: {
		flex:5,
		justifyContent: 'center',
		//fontsize: 20,
	},
	character: {
		flex:8,
		justifyContent: 'flex-start',
	},
})

AppRegistry.registerComponent('Main', () => SwiperComponent)
