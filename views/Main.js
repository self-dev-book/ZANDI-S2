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

	zandi() {
		let date_array = this.props.eventDateList;

		console.log("date_array");
		console.log(date_array);

		// TODO: date_array to count_array



		// today
		let day = (new Date()).getDay(); // 0 is sunday
		let count_array = [
			0, 1, 2, 3, 10, 0, 0, // past
			// 0, 17, 2, 5, 8, 10, 1,
			// 10, 8, 2, 3, 4, 3, 4,
			// 10, 8, 6, 3, 4, 1, 2,
			0, 1, 10// now
		];

		// count_array의 맨 마지막 값은 오늘에 해당한다.

		// push -1 to the back (이번주 요일을 바탕으로 미래의 날에 -1을 채워넣어줌)
		for (let i = 0; i < 6 - day; i++) {
			count_array.push(-1);
		}

		// push 0 to the front (데이터가 너무 적은 경우 과거의 날에 0을 채워넣어줌)
		for (let i = 35 - count_array.length; i > 0; i--) {
			count_array.unshift(0); // unshift : 배열의 맨앞에 추가한다 | shift : 배열의 맨앞에서 꺼낸다
		}

		count_array.splice(0, count_array.length - 35); // (원본을 바꾸는 함수) splice(a, b, c) : 시작위치 a에서 b개 만큼을 지우고 c를 넣는다. c 자리에는 안넣으면 추가되지 않음

		let return_array = [];
		return_array.push(count_array.slice(0, 7)); // (원본을 바꾸지 않는 함수) slice : 배열의 일부를 반환 - 확인만 하는 것임
		return_array.push(count_array.slice(7, 14));
		return_array.push(count_array.slice(14, 21));
		return_array.push(count_array.slice(21, 28));
		return_array.push(count_array.slice(28, 35));

		return return_array;
	}

	makeTile(commit_count, column_index, row_index) {
		const backGroundColors = [
			[13, "#143601"],
			[ 8, "#1a4301"],
			[ 5, "#245501"],
			[ 3, "#538d22"],
			[ 2, "#73a942"],
			[ 1, "#aad576"],
			[ 0, "#F0F0F0"],
			[ -1, "#00000000"]
		];

		for (let i = 0; i < backGroundColors.length; i++) {
			if (commit_count >= backGroundColors[i][0]) {
				return (
					<View
						key={`commit-${column_index}-${row_index}`}
						style={[
							{
								width: '100%',
								aspectRatio: 1,
								borderRadius: 6,
								marginVertical: 8
							},
							{ backgroundColor: backGroundColors[i][1] }
						]}
					/>
				);
			}
		}
	}

	makeWeek() {
		let day = ['일', '월', '화', '수', '목', '금', '토'];

		return (
			<View style={{
				width: '16.6666%',
				flexDirection: 'column',
				justifyContent: 'space-around',
			}}>
			{
				day.map((value, index) => {
					return (
						<View
							key={`week-${index}`}
							style={{
								alignItems: 'center', // 주축
								justifyContent: 'center', // 보조축
								aspectRatio: 1,
								borderRadius: 6,
							}}
						>
							<Text
								style={{
									fontSize: 16,
									color: '#a0a0a0'
								}}
							>
								{value}
							</Text>
						</View>
					);
				})
			}
			</View>
		);
	}

	makeColumn(count_column, column_index) {
		// counts should be 7 * 1 matrix
		return (
			<View
				key={`column-${column_index}`}
				style={{
					flex: 1,
					flexDirection: 'column',
					paddingHorizontal: 8,
				}}
			>
				{
					count_column.map((value, index) => this.makeTile(value, column_index, index))
				}
			</View>
		);
	}

	makeTable(count_matrix) {
		// counts should be 7 * 5 matrix
		return (
			<View style={{
				flexDirection: 'row',
				width: '83.3333%',
			}}>
				{
					count_matrix.map((count_column, index) => this.makeColumn(count_column, index))
				}
			</View>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar style="auto" />
				<View style={styles.header}>
					<View style={{flex:2, justifyContent: 'flex-end', flexDirection: 'row', shadowColor: "#000000", shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 }}}>
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
						<Text style={{paddingBottom: 30, fontSize:20}}>
							잔디 쑥쑥
						</Text>
						<View style={{flexDirection: 'row'}}>
							{
								this.makeWeek()
							}
							{
								this.makeTable(this.zandi())
							}
						</View>
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
		backgroundColor: '#fff',
		height: 64,
		width: '100%',
		paddingTop: 25,
		paddingBottom: 3,
		shadowColor: "#000000", //그림자색
		shadowOpacity: 0.15, //그림자 투명도
		shadowOffset: { width: 2, height: 3 }, //그림자 위치		
	},
	slide1: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	slide2: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 64,
		paddingBottom: 64,
	},
	commit: {
		flex:3,
		justifyContent: 'flex-end',
	},
	announcement: {
		flex:5,
		justifyContent: 'center',
	},
	character: {
		flex:8,
		justifyContent: 'flex-start',
	},
})

AppRegistry.registerComponent('Main', () => SwiperComponent)
