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
	TouchableNativeFeedback,
	ScrollView
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

let TouchableElement = TouchableHighlight;
if (Platform.OS === 'android') {
	TouchableElement = TouchableNativeFeedback;
}

class AlarmCreateScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alarmName: "",
			itemCreateViewList: []
		};
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
					alarmName: this.state.alarmName
				};
				AsyncStorage.setItem("AlarmList."+alarmDetail.alarmName, JSON.stringify(alarmDetail));
				this.setState({
					alarmNameStatus: "",
					alarmNameValue: this.state.alarmName,
					alarmName: ""
				});
				this.props.navigator.pop();
			}
	    }).done();
	}
	render() {
		return (
			<ViewContainer>
				<StatusBarBackground/>
				<ScrollView>
					<Text style={styles.instructions}>
						Alarm Name
					</Text>
					<TextInput
						style={styles.formInput} 
						value={this.state.alarmName}
						onChangeText={(name) => this.setState({alarmName: name})}/>
					<Text>{this.state.alarmNameStatus}</Text>
					<Text style={styles.instructions}>Add Items within the alarm.</Text>
				    <Text style={styles.instructions}>Notify when any item reaches</Text>
					<TouchableElement
				    	style={[styles.button, {backgroundColor: "lightgreen"}]}
				    	onPress={this._saveAlarm}>
				        <Icon name="check" size={25}/>
				    </TouchableElement>
			    </ScrollView>
		    </ViewContainer>
		)
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
		justifyContent: 'center',
		alignItems: 'center',
		height: 30
	},
});

module.exports = AlarmCreateScreen