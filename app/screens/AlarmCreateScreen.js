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
			alarmType: ""
		}
	}
	_saveAlarm() {
		let alarmDetail = {
			alarmName: this.state.alarmName,
			alarmType: this.state.alarmType
		}
		AsyncStorage.setItem(alarmDetail.alarmName, alarmDetail);
	}
	render() {
		let TouchableElement = TouchableHighlight;
	    if (Platform.OS === 'android') {
	     TouchableElement = TouchableNativeFeedback;
	    }
		return (
			<View style={styles.container}>
				<View>
					<Text style={styles.instructions}>
						Alarm Name
					</Text>
					<TextInput
						style={styles.formInput} 
						onChangeValue={(name) => this.setState({alarmName: name})}/>
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
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
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