'use strict'
import React, { Component } from 'react';
import {
  	View,
  	Text,
  	Picker,
  	TextInput,
  	StyleSheet,
  	Platform,
	TouchableHighlight,
	TouchableNativeFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DB from '../database/DB';
import { DBEvents } from 'react-native-db-models'

let TouchableElement = TouchableHighlight;
if (Platform.OS === 'android') {
	TouchableElement = TouchableNativeFeedback;
}

class NewItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			itemName: "",
			itemTotal: "",
			autoDeductAmount: "",
			autoDeductPeriod: "",
			autoDeductPeriodUnit: "day",
			itemNameStatus: "",
			itemTotalStatus: "",
			autoDeductAmountStatus: "",
			autoDeductPeriodStatus: "",
			saveAvailableFlag: true
		}
		this._saveItemDetails = this._saveItemDetails.bind(this);
	}
	_saveItemDetails() {
		if (this.state.itemName === "") {
			this.setState({
				itemNameStatus: "*Required"
			});
		}
		if (this.state.itemTotal === "") {
			this.setState({
				itemTotalStatus: "*Required"
			});
		}
		else {
			let itemDetail = {
				alarmName: this.props.alarmName,
				itemName: this.state.itemName,
				itemTotal: this.state.itemTotal,
				autoDeductAmount: this.state.autoDeductAmount,
				autoDeductPeriod: this.state.autoDeductPeriod,
				autoDeductPeriodUnit: this.state.autoDeductPeriodUnit,
				currentAmount: this.state.itemTotal
			};
			DB.ItemList.add(itemDetail);
			this.setState({
				itemName: "",
				itemTotal: "",
				autoDeductAmount: "",
				autoDeductPeriod: "",
				itemNameStatus: "",
				itemTotalStatus: "",
				autoDeductAmountStatus: "",
				autoDeductPeriodStatus: "",
				saveAvailableFlag: false
			});
			this.setState({
		    	saveAvailableFlag: true
		    });
		}
	}
	render() {
		return (
			<View>
				<Text style={styles.instructions}>Item Name</Text>
				<TextInput
					style={styles.formInput} 
					value={this.state.itemName}
					placeholder="Enter a name for this alarm. (Required)"
					onChangeText={(name) => this.setState({itemName: name})} />
				<Text>{this.state.itemNameStatus}</Text>
				<Text style={styles.instructions}>Item Amount</Text>
				<TextInput
					style={styles.formInput} 
					value={this.state.itemTotal}
					placeholder="Enter how many you have in total. (Required)"
					onChangeText={(total) => this.setState({itemTotal: total})} />
				<Text>{this.state.itemTotalStatus}</Text>
				<Text style={styles.instructions}>Auto Deduct</Text>
				<TextInput
					style={styles.formInput} 
					value={this.state.autoDeductAmount}
					placeholder="Enter how many to deduct every period. (Optional)"
					onChangeText={(amount) => this.setState({autoDeductAmount: amount})} />
				<Text>{this.state.autoDeductAmountStatus}</Text>
				<Text style={styles.instructions}>Every</Text>
				<TextInput
					style={styles.formInput} 
					value={this.state.autoDeductPeriod}
					placeholder="Enter the frequency of the deduction. (Optional)"
					onChangeText={(period) => this.setState({autoDeductPeriod: period})} />
				<Text>{this.state.autoDeductPeriodStatus}</Text>
				<Picker
					selectedValue={this.state.autoDeductPeriodUnit}
					onValueChange={(unit) => this.setState({autoDeductPeriodUnit: unit})}>
					<Picker.Item label="Month(s)" value="month" />
					<Picker.Item label="Week(s)" value="week" />
					<Picker.Item label="Day(s)" value="day" />
					<Picker.Item label="Hour(s)" value="hour" />
					<Picker.Item label="Min" value="min" />
				</Picker>
				{this.props.saveConfirm && this.state.saveAvailableFlag ? 
					this._saveItemDetails() : null
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	statusBarBackground: {
		height: 20,
		backgroundColor: "white"
	},
	instructions: {
  		textAlign: "center",
  		color: '#333333',
  		marginBottom: 5,
  		marginTop: 5
  	},
	formInput: {
	  	flex: 1,
	  	height: 20,
	  	fontSize: 13,
	  	borderWidth: 1,
	  	borderColor: "grey"
  	},
  	button: {
  		backgroundColor: "salmon",
  		justifyContent: 'center',
  		alignItems: 'center',
  		height: 30
  	},
})

module.exports = NewItem