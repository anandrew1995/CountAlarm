'use strict'
import React, { Component } from 'react';
import {
	Text,
	View,
	ListView,
	StyleSheet,
	TouchableOpacity,
	AsyncStorage,
	Platform,
    TouchableHighlight,
    TouchableNativeFeedback,
	Navigator
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

let TouchableElement = TouchableHighlight;
if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
}

class AlarmIndexScreen extends Component {
	constructor(props) {
		super(props);
		let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
		this.state = {
			alarmDataSource: ds.cloneWithRows([])
		};
		this._navigateToAlarmDetails = this._navigateToAlarmDetails.bind(this);
		this._renderAlarmRow = this._renderAlarmRow.bind(this);
		this._getAllAlarms = this._getAllAlarms.bind(this);
		this._createAlarm = this._createAlarm.bind(this);
		// AsyncStorage.clear();
	}
  	_navigateToAlarmDetails(alarm) {
    	this.props.navigator.push({
    		id: "AlarmDetails",
    		alarm: alarm,
    		sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    	});
  	}
  	_renderAlarmRow(alarm) {
  		if (alarm) {
		    return (
				<TouchableOpacity 
					style={styles.alarmRow} 
					onPress={(event) => this._navigateToAlarmDetails(alarm)}>
					<Text style={styles.alarmName}>{`${_.capitalize(alarm.alarmName)}`}</Text>
					<View style={{flex: 1}} />
					<Icon name="chevron-right" size={10} style={styles.alarmDetailsIcon}/>
				</TouchableOpacity>
		    )
		}
  	}
  	_getAllAlarms() {
		AsyncStorage.getAllKeys((err, keys) => {
			let alarmKeyList = []
			keys.map((result, i, key) => {
				if (_.startsWith(key[i], "AlarmList.")) {
					alarmKeyList.push(key[i]);
				}
			});
			AsyncStorage.multiGet(alarmKeyList, (err, stores) => {
				let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
				let alarmViewList = [];
				stores.map((result, i, store) => {
					let key = store[i][0];
					let value = store[i][1];
					alarmViewList.push(JSON.parse(value));
				});
				if (ds.cloneWithRows(alarmViewList) != this.state.alarmDataSource) {
                    this.setState({
	                    alarmDataSource: ds.cloneWithRows(alarmViewList)
	                });
                }
			});
		});
  	}
  	_createAlarm() {
  		this.props.navigator.push({
    		id: "AlarmCreate",
    		sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    	});
  	}
  	componentWillMount() {
		this._getAllAlarms();
  	}
  	render() {
		return (
			<ViewContainer>
				<StatusBarBackground/>
				<Text style={styles.instructions}>CountAlarm</Text>
				<TouchableElement
                    style={[styles.button, {backgroundColor: "lightgreen"}]}
                    onPress={this._createAlarm}>
                    <Icon name="plus" size={25} />
                </TouchableElement>
				<ListView 
					style={{marginTop: 50}}
					dataSource={this.state.alarmDataSource}
					enableEmptySections={true}
					renderRow={(alarm) => {return this._renderAlarmRow(alarm)}} />
			</ViewContainer>
		)
  	}
  	componentDidUpdate(prevProps, prevState) {
        this._getAllAlarms();
    }
}

const styles = StyleSheet.create({
	instructions: {
  		textAlign: "center",
  		color: '#333333',
  		marginBottom: 5,
  		marginTop: 5
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
	},
	button: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },
});

module.exports = AlarmIndexScreen
