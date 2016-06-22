'use strict'
import React, { Component } from 'react';
import {
	Text,
	View,
	ListView,
	StyleSheet,
	TouchableOpacity,
	Navigator
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import DB from '../database/DB';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});

class AlarmIndexScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alarmDataSource: ds.cloneWithRows([])
		};
		this._navigateToAlarmDetails = this._navigateToAlarmDetails.bind(this);
		this._renderAlarmRow = this._renderAlarmRow.bind(this);
		this._getAllAlarms = this._getAllAlarms.bind(this);
		this._getAllAlarms();
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
  		DB.AlarmList.find().then((result) => {
  			this.setState({
                alarmDataSource: ds.cloneWithRows(result)
            });
  		});
  	}
  	render() {
		return (
			<ViewContainer>
				<StatusBarBackground/>
				<Text style={styles.instructions}>CountAlarm</Text>
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
	}
});

module.exports = AlarmIndexScreen
