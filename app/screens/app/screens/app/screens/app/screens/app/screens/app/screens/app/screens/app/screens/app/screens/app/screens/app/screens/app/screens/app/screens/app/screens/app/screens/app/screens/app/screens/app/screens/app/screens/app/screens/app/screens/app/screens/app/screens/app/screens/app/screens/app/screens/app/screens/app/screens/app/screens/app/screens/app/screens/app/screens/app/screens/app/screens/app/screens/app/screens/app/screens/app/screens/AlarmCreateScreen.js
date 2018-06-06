'use strict'
import React, { Component } from 'react';
import {
	Text,
	View,
	StyleSheet,
	AsyncStorage,
	TextInput,
	Platform,
	Dimensions,
	Picker,
	TouchableOpacity,
	ScrollView,
	DeviceEventEmitter
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';

let android;
Platform.OS === 'android' ? android = 2 : android = 1;
let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

class AlarmCreateScreen extends Component {
	static navigationOptions = {
		header: null
	}
	constructor(props) {
		super(props);
		this.state = {
			alarmName: "",
			alarmNameStatus: ""
		};
		this._saveAlarm = this._saveAlarm.bind(this);
	}
	_saveAlarm() {
	    AsyncStorage.getItem("AlarmList."+this.state.alarmName).then((value) => {
	    	this.setState({
				alarmNameStatus: ""
			});
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
			if (this.state.alarmNameStatus === ""){
				let alarmDetail = {
					alarmName: this.state.alarmName
				};
				AsyncStorage.setItem("AlarmList."+alarmDetail.alarmName, JSON.stringify(alarmDetail));
				this.setState({
					alarmName: "",
					alarmNameStatus: ""
				});
				DeviceEventEmitter.emit('saveAlarm');
				this.props.navigation.goBack();
			}
	    }).done();
	}
	render() {
		return (
			<ViewContainer>
				<StatusBarBackground/>
				<ScrollView
					keyboardDismissMode='on-drag'
   					keyboardShouldPersistTaps="handled">
					<TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name="navigate-before" size={30} />
                    </TouchableOpacity>
					<Text style={styles.instructions}>Alarm Name</Text>
					<TextInput
						autoCapitalize="sentences"
						style={styles.formInput}
						value={this.state.alarmName}
						onChangeText={(name) => this.setState({alarmName: name})}/>
					<Text>{this.state.alarmNameStatus}</Text>
					<Text style={styles.instructions}>Add Items within the alarm.</Text>
					<TouchableOpacity
				    	style={[styles.button, {backgroundColor: "lightgreen"}]}
				    	onPress={() => this._saveAlarm()}>
				        <Icon name="done" size={25}/>
				    </TouchableOpacity>
			    </ScrollView>
		    </ViewContainer>
		)
	}
}

const styles = StyleSheet.create({
	formInput: {
	  	flex: 1,
	  	height: deviceHeight*0.03*android,
	  	fontSize: 13,
	  	borderWidth: 1,
	  	borderColor: "grey",
	  	textAlign: "center"
  	},
	instructions: {
        textAlign: "center",
        color: '#333333',
        marginBottom: deviceHeight*0.01,
        marginTop: deviceHeight*0.01
    },
	button: {
  		justifyContent: 'center',
  		alignItems: 'center',
  		height: deviceHeight*0.04
  	}
});

module.exports = AlarmCreateScreen
