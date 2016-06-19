'use strict'
import React, { Component } from 'react';
import {
	Text,
	View,
	ListView,
	StyleSheet,
	TouchableOpacity,
	AsyncStorage,
	Navigator
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

class AlarmIndexScreen extends Component {
	constructor(props) {
		super(props);
		let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
		this.state = {
			alarmDataSource: ds.cloneWithRows([{}])
		}
		this._navigateToAlarmDetails = this._navigateToAlarmDetails.bind(this);
		this._renderAlarmRow = this._renderAlarmRow.bind(this);
		this._getAllAlarms = this._getAllAlarms.bind(this);
	}
  	_navigateToAlarmDetails(alarm) {
    	this.props.navigator.push({
    		id: "AlarmDetails",
    		alarm: alarm,
    		sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    	})
  	}
  	_renderAlarmRow(alarm) {
  		if (alarm) {
		    return (
				<TouchableOpacity style={styles.alarmRow} onPress={(event) => this._navigateToAlarmDetails(alarm)}>
					<Text style={styles.alarmName}>{`${_.capitalize(alarm.alarmName)}`}</Text>
					<View style={{flex: 1}} />
					<Icon name="chevron-right" size={10} style={styles.alarmDetailsIcon}/>
				</TouchableOpacity>
		    )
		}
		else {
			return null;
		}
  	}
  	_getAllAlarms() {
		AsyncStorage.getAllKeys((err, keys) => {
			let alarmkeyList = []
			keys.map((result, i, key) => {
				if (_.startsWith(key[i], "AlarmList.")) {
					alarmkeyList.push(key[i]);
				}
			});
			AsyncStorage.multiGet(alarmkeyList, (err, stores) => {
				let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
				let alarmViewList = [];
				stores.map((result, i, store) => {
					let key = store[i][0];
					let value = store[i][1];
					alarmViewList.push(JSON.parse(value));
				});
				console.log(alarmViewList);
				this.setState({
					alarmDataSource: ds.cloneWithRows(alarmViewList)
				});
			});
		});
  	}
  	render() {
  		this._getAllAlarms();
		return (
			<ViewContainer>
				<StatusBarBackground style={{backgroundColor: "mistyrose"}}/>
				<Text style={styles.container}>
					CountAlarm
				</Text>
				<ListView 
					style={{marginTop: 100}}
					dataSource={this.state.alarmDataSource}
					enableEmptySections={true}
					renderRow={(alarm) => {return this._renderAlarmRow(alarm)}} />
			</ViewContainer>
		)
  	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		textAlign: 'center',
	    justifyContent: 'center',
	    alignItems: 'stretch',
	},
	alarmRow: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		height: 50
	},
	alarmName: {
		marginLeft: 25
	},
	alarmDetailsIcon: {
		color: "green",
		height: 20,
		width: 20,
		marginRight: 25
	}
});

module.exports = AlarmIndexScreen
