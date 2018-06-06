'use strict'
import React, { Component } from 'react';
import {
	Text,
	View,
	ListView,
	StyleSheet,
	TouchableOpacity,
	AsyncStorage,
	Dimensions,
	Navigator,
	Alert,
	DeviceEventEmitter,
	Platform
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

class AlarmIndexScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alarmDataSource: ds.cloneWithRows([""]),
			alarmCount: 0,
			changeAvailable: true,
			viewEdit: false
		};
		this._navigateToAlarmDetails = this._navigateToAlarmDetails.bind(this);
		this._renderAlarmRow = this._renderAlarmRow.bind(this);
		this._getAllAlarms = this._getAllAlarms.bind(this);
		this._createAlarm = this._createAlarm.bind(this);
		this._deleteAlarm = this._deleteAlarm.bind(this);
		this._confirmDelete = this._confirmDelete.bind(this);
		this._toggleEdit = this._toggleEdit.bind(this);
		// this._startOffsetTimer = this._startOffsetTimer.bind(this);
		// this._startDailyTimer = this._startDailyTimer.bind(this);
		// this._reduceAutoItems = this._reduceAutoItems.bind(this);
		// AsyncStorage.clear();
	}
  	_navigateToAlarmDetails(alarm) {
    	this.props.navigator.push({
    		id: "AlarmDetails",
    		alarm: alarm,
    		sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    	});
    	this.setState({
    		changeAvailable: true
    	});
  	}
  	_renderAlarmRow(alarm) {
  		if (alarm) {
		    return (
		    	<View style={{flexDirection: "row"}}>
					<TouchableOpacity
						style={styles.alarmRow}
						onPress={(event) => this._navigateToAlarmDetails(alarm)}>
						<Text style={styles.alarmName}>{alarm.alarmName}</Text>
						<Icon name="navigate-next" size={10} style={styles.alarmDetailsIcon}/>
					</TouchableOpacity>
					{this.state.viewEdit ?
	                    <TouchableOpacity
	                    	style={{marginTop: deviceHeight*0.01}}
	                        onPress={() => this._confirmDelete(alarm)}>
	                        <Icon name="clear" size={25} />
	                    </TouchableOpacity>
	                    : null}
				</View>
		    )
		}
		else {
			return null;
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
			if (this.state.changeAvailable || alarmKeyList.length != this.state.alarmCount) {
				AsyncStorage.multiGet(alarmKeyList, (err, stores) => {
					let alarmViewList = [];
					stores.map((result, i, store) => {
						let key = store[i][0];
						let value = store[i][1];
						alarmViewList.push(JSON.parse(value));
					});
					if (ds.cloneWithRows(alarmViewList) != this.state.alarmDataSource) {
	                    this.setState({
		                    alarmDataSource: ds.cloneWithRows(alarmViewList),
		                    alarmCount: alarmViewList.length,
		                    changeAvailable: false
		                });
	                }
				});
			}
		});
  	}
  	_createAlarm() {
  		this.props.navigator.push({
    		id: "AlarmCreate",
    		sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    	});
    	this.setState({
    		changeAvailable: true
    	});
  	}
  	_deleteAlarm(alarm) {
        AsyncStorage.removeItem("AlarmList."+alarm.alarmName);
        AsyncStorage.getAllKeys((err, keys) => {
            let itemKeyList = [];
            keys.map((result, i, key) => {
                if (_.startsWith(key[i], "ItemList."+alarm.alarmName)) {
                    itemKeyList.push(key[i]);
                }
            });
            AsyncStorage.multiRemove(itemKeyList);
        });
        this.setState({
        	changeAvailable: true
        })
    }
    _confirmDelete(alarm) {
    	Alert.alert(
		  'Deleting Alarm',
		  'Are you sure?',
		  [
		    {text: 'Yes', onPress: () => this._deleteAlarm(alarm)},
		    {text: 'No'},
		  ]
		);
    }
    _toggleEdit() {
        if (this.state.viewEdit) {
            this.setState({
                viewEdit: false
            });
        }
        else if (!this.state.viewEdit) {
            this.setState({
                viewEdit: true
            });
        }
    }
  //   _reduceAutoItems() {
  //   	AsyncStorage.getAllKeys((err, keys) => {
  //           let itemKeyList = []
  //           keys.map((result, i, key) => {
  //               if (_.startsWith(key[i], "ItemList.")) {
  //                   itemKeyList.push(key[i]);
  //               }
  //           });
  //           AsyncStorage.multiGet(itemKeyList, (err, stores) => {
  //               let itemViewList = [];
  //               stores.map((result, i, store) => {
  //                   let key = store[i][0];
  //                   let value = store[i][1];
  //                   if (value.autoDeductAmount > 0) {
  //                   	let itemDetail = {
  //                   		currentAmount: value.currentAmount - value.autoDeductAmount
  //                   	};
  //                   	AsyncStorage.mergeItem(key, itemDetail);
  //                   }
  //               });
  //           });
  //       });
  //   }
  //   _startDailyTimer() {
  //   	BackgroundTimer.stop();
  //   	this._reduceAutoItems();
  //   	//86400000
  //   	BackgroundTimer.start(3000);
  //   	DeviceEventEmitter.addListener('backgroundTimer', () => {
		// 	this._reduceAutoItems();
		// });
  //   }
  //   _startOffsetTimer() {
		// AsyncStorage.getItem("Timer").then((value) => {
		// 	if (value === null || value === 'false') {
		// 		let now = new Date();
		// 		let offset = moment().endOf('day')-now;
		// 		BackgroundTimer.start(offset);
		// 		DeviceEventEmitter.addListener('backgroundTimer', () => {
		// 			this._startDailyTimer();
		// 		});
		// 		AsyncStorage.setItem("Timer", 'true');
		// 	}
		// });
  //   }
  	componentDidMount() {
		this._getAllAlarms();
  	}
  	render() {
		return (
			<ViewContainer>
				{Platform.OS === 'android' ? null :
					<StatusBarBackground/>
				}
				<View style={{flexDirection: "row"}}>
					<Text style={[styles.appName, {flex: 1, marginLeft: deviceWidth*0.07}]}>CountAlarm</Text>
					<TouchableOpacity
	                    style={{marginTop: deviceHeight*0.01}}
	                    onPress={() => this._toggleEdit()}>
	                    <Icon style={{fontSize: 17, marginRight: deviceWidth*0.02}} name="edit" size={25} />
	                </TouchableOpacity>
                </View>
				<Text style={[styles.instructions, {marginTop: deviceHeight*0.05}]}>Add an alarm</Text>
				<TouchableOpacity
                    style={[styles.button, {backgroundColor: "lightgreen"}]}
                    onPress={() => this._createAlarm()}>
                    <Icon name="add-alarm" size={25} />
                </TouchableOpacity>
				<TouchableOpacity
                    style={[styles.button, {backgroundColor: "lightgreen"}]}
                    onPress={() => this._createAlarm()}>
                    <Icon name="add-alarm" size={25} />
                </TouchableOpacity>
                {this.state.alarmCount === 0 ?
                	<Text style={[styles.instructions, {marginTop: deviceHeight*0.3}]}>You have no alarms.</Text>
					: null
				}
				<ListView
					style={{marginTop: deviceHeight*0.03}}
					dataSource={this.state.alarmDataSource}
					enableEmptySections={true}
					renderRow={(alarm) => {return this._renderAlarmRow(alarm)}} />
			</ViewContainer>
		)
  	}
  	componentDidUpdate() {
  		this._getAllAlarms();
    }
}

const styles = StyleSheet.create({
	appName: {
        fontSize: 20,
        textAlign: "center"
	},
	instructions: {
  		textAlign: "center",
  		color: '#333333',
  		marginBottom: deviceHeight*0.01,
  		marginTop: deviceHeight*0.01
  	},
	alarmRow: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		height: deviceHeight*0.065
	},
	alarmName: {
		marginLeft: deviceWidth*0.07,
		width: deviceWidth*0.8
	},
	alarmDetailsIcon: {
		color: "green",
		marginTop: deviceHeight*0.03,
		height: deviceHeight*0.05,
		width: deviceHeight*0.02,
	},
	button: {
        justifyContent: 'center',
        alignItems: 'center',
        height: deviceHeight*0.04
    },
});

module.exports = AlarmIndexScreen
