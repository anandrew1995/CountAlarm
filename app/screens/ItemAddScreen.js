'use strict'
import React, { Component } from 'react';
import {
  	View,
  	ScrollView,
  	Text,
  	Picker,
  	TextInput,
  	StyleSheet,
  	Platform,
	TouchableHighlight,
	TouchableNativeFeedback,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import Icon from 'react-native-vector-icons/FontAwesome';

let TouchableElement = TouchableHighlight;
if (Platform.OS === 'android') {
	TouchableElement = TouchableNativeFeedback;
}

class ItemAddScreen extends Component {
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
			autoDeductPeriodStatus: ""
		}
		this._saveItemDetails = this._saveItemDetails.bind(this);
	}
	_saveItemDetails() {
		AsyncStorage.getItem("ItemList."+this.props.alarm.alarmName+"."+this.state.itemName).then((value) => {
	    	this.state.itemName === "" ?
				this.setState({
					itemNameStatus: "*Required"
				})
				:
				this.setState({
					itemNameStatus: ""
				});
			this.state.itemTotal === "" ?
				this.setState({
					itemTotalStatus: "*Required"
				})
				:
				this.setState({
					itemTotalStatus: ""
				});
			value != null ?
				this.setState({
					itemNameStatus: "This item already exists."
				})
				:
				this.setState({
					itemNameStatus: ""
				});
			!(this.state.itemTotal > 0) ?
				this.setState({
					itemTotalStatus: "You must enter a number."
				})
				:
				this.setState({
					itemTotalStatus: ""
				});
			if (this.state.autoDeductAmount != "" && this.state.autoDeductPeriod != "") {
				!(this.state.autoDeductAmount > 0) ?
					this.setState({
						autoDeductAmountStatus: "You must enter a number."
					})
					:
					this.setState({
						autoDeductAmountStatus: ""
					});
				!(this.state.autoDeductPeriod > 0) ?
					this.setState({
						autoDeductPeriodStatus: "You must enter a number."
					})
					:
					this.setState({
						autoDeductPeriodStatus: ""
					});
			}
			else if (this.state.autoDeductAmount != "" || this.state.autoDeductPeriod != ""){
				if (this.state.autoDeductAmount === "") {
					this.setState({
						autoDeductAmountStatus: "You must enter both values"
					});
				}
				if (this.state.autoDeductPeriod === "") {
					this.setState({
						autoDeductPeriodStatus: "You must enter both values"
					});
				}
			}
			if (this.state.itemNameStatus === "" && 
				this.state.itemTotalStatus === "" && 
				this.state.autoDeductAmountStatus === "" && 
				this.state.autoDeductPeriodStatus === "") {
				let itemDetail = {
					itemName: this.state.itemName,
					itemTotal: this.state.itemTotal,
					autoDeductAmount: this.state.autoDeductAmount,
					autoDeductPeriod: this.state.autoDeductPeriod,
					autoDeductPeriodUnit: this.state.autoDeductPeriodUnit,
					currentAmount: this.state.itemTotal
				};
				AsyncStorage.setItem("ItemList."+this.props.alarm.alarmName+"."+this.state.itemName, JSON.stringify(itemDetail));
				this.setState({
					itemName: "",
					itemTotal: "",
					autoDeductAmount: "",
					autoDeductPeriod: "",
					itemNameStatus: "",
					itemTotalStatus: "",
					autoDeductAmountStatus: "",
					autoDeductPeriodStatus: ""
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
					<TouchableOpacity
                        onPress={() => this.props.navigator.pop()}>
                        <Icon name="chevron-left" size={30} />
                    </TouchableOpacity>
					<Text style={styles.instructions}>Item Name</Text>
					<TextInput
						autoCapitalize="sentences"
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
					<TouchableElement
                        style={[styles.button, {backgroundColor: "salmon"}]}
                        onPress={this._saveItemDetails}>
                        <Icon name="plus" size={25} />
                    </TouchableElement>
				</ScrollView>
			</ViewContainer>
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
  		justifyContent: 'center',
  		alignItems: 'center',
  		height: 30
  	},
})

module.exports = ItemAddScreen