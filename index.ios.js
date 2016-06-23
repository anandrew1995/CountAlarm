'use strict'
import React, { Component } from 'react';
import {
	AppRegistry,
  	StyleSheet,
  	Text,
  	TabBarIOS
} from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

class CountAlarm extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  selectedTab: "AlarmIndex"
		}
	}
	render() {
		return (
			<AppNavigator initialRoute={{id: "AlarmIndex"}} />
		)
		// return (
		// 	<TabBarIOS
		// 		selectedTab={this.state.selectedTab}>
		// 		<Icon.TabBarItemIOS
		// 			selected={this.state.selectedTab === "AlarmIndex"}
		// 			title={`Alarms`}
		// 			iconName="access-alarms"
		// 			onPress={() => this.setState({selectedTab: "AlarmIndex"})}>
		// 			<AppNavigator initialRoute={{id: "AlarmIndex"}} />
		// 		</Icon.TabBarItemIOS>
		// 		<Icon.TabBarItemIOS
		// 			selected={this.state.selectedTab === "AlarmCreate"}
		// 			title={`New Alarm`}
		// 			iconName="add-alarm"
		// 			onPress={() => this.setState({selectedTab: "AlarmCreate"})}>
		// 			<AppNavigator initialRoute={{id: "AlarmCreate"}} />
		// 		</Icon.TabBarItemIOS>
		// 	</TabBarIOS>
		// )
	}

}

const styles = StyleSheet.create({
	navigatorStyles: {

	}
});

AppRegistry.registerComponent('CountAlarm', () => CountAlarm);
