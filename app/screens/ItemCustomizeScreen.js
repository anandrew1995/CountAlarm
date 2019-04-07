'use strict'
import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    Picker,
    TextInput,
    Platform,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    DeviceEventEmitter,
    BackHandler
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

let android;
Platform.OS === 'android' ? android = 2 : android = 1;
let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

class ItemCustomizeScreen extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            itemName: this.props.navigation.getParam('item',{}).itemName || "",
            itemTotal: this.props.navigation.getParam('item',{}).itemTotal || "",
            notifyAmount: this.props.navigation.getParam('item',{}).notifyAmount || "",
            autoDeductAmount: this.props.navigation.getParam('item',{}).autoDeductAmount || "",
            autoDeductPeriod: this.props.navigation.getParam('item',{}).autoDeductPeriod || "",
            autoDeductPeriodUnit: this.props.navigation.getParam('item',{}).autoDeductPeriodUnit || "day",
            itemNameStatus: "",
            itemTotalStatus: "",
            notifyAmountStatus: "",
            autoDeductAmountStatus: "",
            autoDeductPeriodStatus: ""
        }
        this._noEdit = this._noEdit.bind(this);
        this._saveItemDetails = this._saveItemDetails.bind(this);

        BackHandler.addEventListener('hardwareBackPress', function() {
            //QQQQQQ
        });
    }
    _noEdit() {
        let itemDetail = {
            itemName: this.props.navigation.getParam('item').itemName,
            itemTotal: this.props.navigation.getParam('item').itemTotal,
            autoDeductAmount: this.props.navigation.getParam('item').autoDeductAmount,
            autoDeductPeriod: this.props.navigation.getParam('item').autoDeductPeriod,
            autoDeductPeriodUnit: this.props.navigation.getParam('item').autoDeductPeriodUnit,
            currentAmount: this.props.navigation.getParam('item').currentAmount
        };
        AsyncStorage.setItem("ItemList."+this.props.navigation.getParam('alarm').alarmName+"."+itemDetail.itemName, JSON.stringify(itemDetail));
        DeviceEventEmitter.emit('saveItem');
        this.props.navigation.goBack();
    }
    _saveItemDetails() {
        AsyncStorage.getItem("ItemList."+this.props.navigation.getParam('alarm').alarmName+"."+this.state.itemName).then((value) => {
            if (this.state.itemName === "") {
                this.setState({
                    itemNameStatus: "*Required"
                });
            }
            else {
                if (value != null) {
                    this.setState({
                        itemNameStatus: "This item already exists."
                    });
                }
                else {
                    this.setState({
                        itemNameStatus: ""
                    });
                }
            }
            if (this.state.itemTotal === "") {
                this.setState({
                    itemTotalStatus: "*Required"
                });
            }
            else {
                if (!(this.state.itemTotal > 0)) {
                    this.setState({
                        itemTotalStatus: "You must enter a number > 0."
                    });
                }
                else {
                    this.setState({
                        itemTotalStatus: ""
                    });
                }
            }
            if (this.state.notifyAmount !== "") {
                if (!(this.state.notifyAmount >= 0)) {
                    this.setState({
                        notifyAmountStatus: "You must enter a number."
                    });
                }
                else {
                    this.setState({
                        notifyAmountStatus: ""
                    });
                }
            }
            else {
                this.setState({
                    notifyAmountStatus: ""
                });
            }
            if (this.state.autoDeductAmount != "" && this.state.autoDeductPeriod != "") {
                !(this.state.autoDeductAmount >= 0) ?
                this.setState({
                    autoDeductAmountStatus: "You must enter a number."
                })
                :
                this.setState({
                    autoDeductAmountStatus: ""
                });
                !(this.state.autoDeductPeriod > 0) ?
                this.setState({
                    autoDeductPeriodStatus: "You must enter a number > 0."
                })
                :
                this.setState({
                    autoDeductPeriodStatus: ""
                });
            }
            else if (this.state.autoDeductAmount != "" || this.state.autoDeductPeriod != ""){
                this.setState({
                    autoDeductAmountStatus: "You must enter both values",
                    autoDeductPeriodStatus: "You must enter both values"
                });
            }
            if (this.state.itemNameStatus === "" &&
            this.state.itemTotalStatus === "" &&
            this.state.autoDeductAmountStatus === "" &&
            this.state.autoDeductPeriodStatus === "") {
                let autoDeductCounter = 0;
                if (this.state.autoDeductPeriodUnit === "day") {
                    autoDeductCounter = this.state.autoDeductPeriod;
                }
                else if (this.state.autoDeductPeriodUnit === "week") {
                    autoDeductCounter = this.state.autoDeductPeriod * 7;
                }
                else if (this.state.autoDeductPeriodUnit === "month") {
                    let month = moment().month();
                    let year = moment().year();
                    let febDays = 28;
                    if (year % 4 != 0) {
                        febDays = 28;
                    }
                    else if (year % 100 != 0) {
                        febDays = 29;
                    }
                    else if (year % 400 != 0) {
                        febDays = 28;
                    }
                    else {
                        febDays = 29;
                    }
                    let monthArray = [31, febDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    let monthIndex = 0;
                    for (let i = 0; i < this.state.autoDeductPeriod; i++) {
                        monthIndex = (month+i) % 12;
                        autoDeductCounter += monthArray[month+i];
                    }
                }
                let itemDetail = {
                    itemName: this.state.itemName,
                    itemTotal: this.state.itemTotal,
                    notifyAmount: this.state.notifyAmount || "0",
                    autoDeductAmount: this.state.autoDeductAmount,
                    autoDeductPeriod: this.state.autoDeductPeriod,
                    autoDeductPeriodUnit: this.state.autoDeductPeriodUnit,
                    autoDeductCounter: autoDeductCounter,
                    currentAmount: this.state.itemTotal
                };
                AsyncStorage.setItem("ItemList."+this.props.navigation.getParam('alarm').alarmName+"."+this.state.itemName, JSON.stringify(itemDetail));
                this.setState({
                    itemName: "",
                    itemTotal: "",
                    notifyAmount: "",
                    autoDeductAmount: "",
                    autoDeductPeriod: "",
                    itemNameStatus: "",
                    itemTotalStatus: "",
                    notifyAmountStatus: "",
                    autoDeductAmountStatus: "",
                    autoDeductPeriodStatus: ""
                });
                DeviceEventEmitter.emit('saveItem');
                this.props.navigation.goBack();
            }
        }).done();
    }
    render() {
        return (
            <ViewContainer>
            <StatusBarBackground/>
            <ScrollView
            keyboardShouldPersistTaps="handled">
            <TouchableOpacity
            onPress={() => this._noEdit()}>
            <Icon name="navigate-before" size={30} />
            </TouchableOpacity>
            <Text style={styles.instructions}>Item Name</Text>
            <TextInput
            autoCapitalize="sentences"
            style={styles.formInput}
            value={this.state.itemName}
            placeholder="Enter a name for this item. (Required)"
            onChangeText={(name) => this.setState({itemName: name})} />
            <Text>{this.state.itemNameStatus}</Text>
            <Text style={styles.instructions}>Item Amount</Text>
            <TextInput
            style={styles.formInput}
            value={this.state.itemTotal}
            placeholder="Enter how many you have in total. (Required)"
            onChangeText={(total) => this.setState({itemTotal: total})} />
            <Text>{this.state.itemTotalStatus}</Text>
            <Text style={styles.instructions}>Notify Amount</Text>
            <TextInput
            style={styles.formInput}
            value={this.state.notifyAmount}
            placeholder="Notify when certain amount left. (Default: 0)"
            onChangeText={(amount) => this.setState({notifyAmount: amount})}/>
            <Text>{this.state.notifyAmountStatus}</Text>
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
            <Picker.Item label="Month(s) (same day of the month)" value="month" />
            <Picker.Item label="Week(s)" value="week" />
            <Picker.Item label="Day(s)" value="day" />
            </Picker>
            <TouchableOpacity
            style={[styles.button, {backgroundColor: "lightgreen"}]}
            onPress={() => this._saveItemDetails()}>
            <Icon name="check" size={25} />
            </TouchableOpacity>
            </ScrollView>
            </ViewContainer>
        )
    }
}

const styles = StyleSheet.create({
    instructions: {
        textAlign: "center",
        color: '#333333',
        marginBottom: deviceHeight*0.01,
        marginTop: deviceHeight*0.01
    },
    formInput: {
        flex: 1,
        height: deviceHeight*0.03*android,
        fontSize: 13,
        borderWidth: 1,
        borderColor: "grey",
        textAlign: "center"
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        height: deviceHeight*0.04
    },
})

module.exports = ItemCustomizeScreen
