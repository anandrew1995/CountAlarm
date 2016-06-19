'use strict'
import React, { Component } from 'react';
import {
	Text,
	View,
	StyleSheet,
	AsyncStorage,
	TextInput,
	Picker,
	Platform,
	TouchableHighlight,
	TouchableNativeFeedback
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';

class AlarmCreateScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alarmName: "",
			alarmType: "Deductible"
		}
		this._saveAlarm = this._saveAlarm.bind(this);
	}
	_saveAlarm() {
	    AsyncStorage.getItem("AlarmList."+this.state.alarmName).then((value) => {
	    	if (this.state.alarmName === "") {
				this.setState({
					alarmNameStatus: "Please enter a name."
				});
			}
	    	else if (value != null) {
				this.setState({
					alarmNameStatus: "This name already exists."
				});
			}
			else {
				let alarmDetail = {
					alarmName: this.state.alarmName,
					alarmType: this.state.alarmType
				};
				AsyncStorage.setItem("AlarmList."+alarmDetail.alarmName, JSON.stringify(alarmDetail));
				this.setState({
					alarmNameStatus: "",
					alarmName: ""
				});
			}
	    }).done();
	}
	render() {
		let TouchableElement = TouchableHighlight;
	    if (Platform.OS === 'android') {
	     TouchableElement = TouchableNativeFeedback;
	    }
		return (
			<ViewContainer>
			<StatusBarBackground style={{backgroundColor: "mistyrose"}}/>
				<View>
					<Text>
						{this.state.alarmName}
					</Text>
					<Text>
						{this.state.alarmType}
					</Text>
					<Text style={styles.instructions}>
						Alarm Name
					</Text>
					<TextInput
						style={styles.formInput} 
						value={this.state.alarmName}
						onChangeText={(name) => this.setState({alarmName: name})}/>
					<Text>{this.state.alarmNameStatus}</Text>
					<Text style={styles.instructions}>
						Alarm Type
					</Text>
					<Picker
					  	selectedValue={this.state.alarmType}
					  	onValueChange={(type) => this.setState({alarmType: type})}>
					  	<Picker.Item label="Deductible" value="Deductible" />
					  	<Picker.Item label="Time" value="Time" />
					</Picker>
				</View>
				<TouchableElement
			    	style={styles.button}
			    	onPress={this._saveAlarm}>
			        <Text>Save</Text>
			    </TouchableElement>
			</ViewContainer>
		)
	}
	componentDidMount() {
  	   	AsyncStorage.getAllKeys((err, keys) => {
  	   		let alarmList = []
  	   		keys.map((result, i, key) => {
  	   			if (_.startsWith(key[i], "AlarmList.")) {
  	   				alarmList.push(key[i]);
  	   			}
  	   		});
  	   		AsyncStorage.multiGet(alarmList, (err, stores) => {
				stores.map((result, i, store) => {
	 				let key = store[i][0];
	 				let value = store[i][1];
				});
			});
		});
  	 }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  formInput: {
  	flex: 1,
  	height: 20,
  	fontSize: 13,
  	borderWidth: 1,
  	borderColor: "grey"
  },
  instructions: {
  	textAlign: "center",
  	color: '#333333',
  	marginBottom: 5,
  	marginTop: 5
  },
  saved: {
  	fontSize: 20,
  	textAlign: 'center',
  	margin: 10
  },
  button: {
  	backgroundColor: "coral",
  	justifyContent: 'center',
  	alignItems: 'center',
  	height: 30
  },
});

module.exports = AlarmCreateScreen