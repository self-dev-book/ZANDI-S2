import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, Text, View } from 'react-native';
import ReactNativeSettingsPage, { 
	SectionRow, 
	NavigateRow,
	CheckRow
} from 'react-native-settings-page';

import styles from '../styles/style';


class Settings extends React.Component {
	// TODO: implement your navigationOptions
	state = {
		check: false,
		switch: false,
		value: 40
	}
	_navigateToScreen = () => {
		const { navigation } = this.props
		navigation.navigate('Your-Screen-Name');
	}
	render() {
		return (
			<ReactNativeSettingsPage>
				<SectionRow text=''>
					<NavigateRow
						text='알람 설정'
						iconName='bell'
						onPressCallback={this._navigateToScreen} />
						<NavigateRow
						text='로그아웃'
						iconName='user-times'
						onPressCallback={this._navigateToScreen} />
				</SectionRow>
			</ReactNativeSettingsPage>
		)
	}
}

export default Settings

// export default () => {
//   return (
//     <View style={styles.container}>
//       <Text>This is the Setting</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// };
