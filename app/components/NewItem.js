'use strict'
import React, { Component } from 'react';
import {
  	View,
  	Text,
  	TextInput,
  	StyleSheet,
  	Platform,
	TouchableHighlight,
	TouchableNativeFeedback,
	AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class NewItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			itemName: "",
			itemTotal: "",
			itemNameStatus: "",
			itemTotalStatus: "",
			saveAvailableFlag: true
		}
		this._saveItemDetails = this._saveItemDetails.bind(this);
	}
	_saveItemDetails() {
		AsyncStorage.getItem("ItemList."+this.props.alarmName+"."+this.state.itemName).then((value) => {
	    	if (this.state.itemName === "") {
				this.setState({
					itemNameStatus: "Please enter a name."
				});
			}
			if (this.state.itemTotal === "") {
				this.setState({
					itemTotalStatus: "Please enter how many."
				});
			}
	    	else if (value != null) {
				this.setState({
					itemNameStatus: "This item name already exists."
				});
			}
			else {
				let itemDetail = {
					itemName: this.state.itemName,
					itemTotal: this.state.itemTotal
				};
				AsyncStorage.setItem("ItemList."+this.props.alarmName+"."+this.state.itemName, JSON.stringify(itemDetail));
				this.setState({
					itemName: "",
					itemTotal: "",
					itemNameStatus: "",
					itemTotalStatus: "",
					saveAvailableFlag: false
				});
				this.setState({
			    	saveAvailableFlag: true
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
			<View>
				<Text style={styles.instructions}>Item Name</Text>
				<TextInput
					style={styles.formInput} 
					value={this.state.itemName}
					onChangeText={(name) => this.setState({itemName: name})} />
				<Text>{this.state.itemNameStatus}</Text>
				<Text style={styles.instructions}>How many?</Text>
				<TextInput
					style={styles.formInput} 
					value={this.state.itemTotal}
					onChangeText={(total) => this.setState({itemTotal: total})} />
				<Text>{this.state.itemTotalStatus}</Text>
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