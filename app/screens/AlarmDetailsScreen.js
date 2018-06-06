'use strict'
import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    ScrollView,
    Dimensions,
    Alert,
    DeviceEventEmitter
} from 'react-native';

import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

class AlarmDetailsScreen extends Component {
    static navigationOptions = {
		header: null
	}
    constructor(props) {
        super(props);
        this.state = {
            itemDataSource: ds.cloneWithRows([""]),
            itemCount: 0,
            changeAvailable: true,
            viewEdit: false,
            alarmName: this.props.navigation.getParam('alarm').alarmName
        };
        this._addOne = this._addOne.bind(this);
        this._deductOne = this._deductOne.bind(this);
        this._renderItemRow = this._renderItemRow.bind(this);
        this._getAllItems = this._getAllItems.bind(this);
        this._navigateToItemEditScreen = this._navigateToItemEditScreen.bind(this);
        this._navigateToItemAddScreen = this._navigateToItemAddScreen.bind(this);
        this._editItem = this._editItem.bind(this);
        this._deleteItem = this._deleteItem.bind(this);
        this._resetCount = this._resetCount.bind(this);
        this._confirmDelete = this._confirmDelete.bind(this);
        this._toggleEdit = this._toggleEdit.bind(this);
    }
    _addOne(item) {
        if (item.currentAmount < item.itemTotal) {
            let itemDetail = {
                currentAmount: item.currentAmount+1
            };
            AsyncStorage.mergeItem("ItemList."+this.state.alarmName+"."+item.itemName, JSON.stringify(itemDetail));
            this.setState({
                changeAvailable: true
            });
        }
    }
    _deductOne(item) {
        if (item.currentAmount > 0) {
            let itemDetail = {
                currentAmount: item.currentAmount-1
            };
            AsyncStorage.mergeItem("ItemList."+this.state.alarmName+"."+item.itemName, JSON.stringify(itemDetail));
            this.setState({
                changeAvailable: true
            });
        }
    }
    _navigateToItemEditScreen(item) {
        this.props.navigation.navigate('ItemCustomize', { alarm: this.props.navigation.getParam('alarm'), item })
    }
    _editItem(item) {
        this._deleteItem(item);
        this._navigateToItemEditScreen(item);
    }
    _deleteItem(item) {
        AsyncStorage.removeItem("ItemList."+this.state.alarmName+"."+item.itemName);
        this.setState({
            changeAvailable: true
        });
    }
    _confirmDelete(item) {
        Alert.alert(
          'Deleting Item',
          'Are you sure?',
          [
            {text: 'Yes', onPress: () => this._deleteItem(item)},
            {text: 'No'},
          ]
        );
    }
    _resetCount(item) {
        let itemDetail = {
            currentAmount: item.itemTotal
        };
        AsyncStorage.mergeItem("ItemList."+this.state.alarmName+"."+item.itemName, JSON.stringify(itemDetail));
        this.setState({
            changeAvailable: true
        });
    }
    _renderItemRow(item) {
        if (item) {
            return (
                <View style={{marginLeft: deviceWidth*0.05, marginTop: deviceHeight*0.02}}>
                    {this.state.viewEdit ?
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            style={{marginLeft: deviceWidth*0.8}}
                            onPress={() => this._editItem(item)}>
                            <MaterialIcons name="mode-edit" size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{marginLeft: deviceWidth*0.01}}
                            onPress={() => this._confirmDelete(item)}>
                            <MaterialIcons name="clear" size={25} />
                        </TouchableOpacity>
                    </View>
                    : null}
                    <View>
                        <Text style={{fontWeight: "bold"}}>
                        {_.capitalize(item.itemName)}
                        </Text>
                        <Text>
                            Total: {item.itemTotal}
                        </Text>
                        <Text>
                            Current: {item.currentAmount}
                        </Text>
                        {item.autoDeductAmount == "" ?
                            <Text>
                                Auto-Deduct: N/A
                            </Text>
                            :
                            <Text>
                                Auto Deduct: {item.autoDeductAmount} every {item.autoDeductPeriod} {item.autoDeductPeriodUnit}(s)
                            </Text>
                        }
                    </View>
                    <TouchableOpacity
                        style={[styles.itemButton, {backgroundColor: "aliceblue"}]}
                        onPress={() => this._addOne(item)}>
                        <MaterialIcons name="exposure-plus-1" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.itemButton, {backgroundColor: "lavenderblush"}]}
                        onPress={() => this._deductOne(item)}>
                        <MaterialIcons name="exposure-neg-1" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.itemButton, {backgroundColor: "yellowgreen"}]}
                        onPress={() => this._resetCount(item)}>
                        <MaterialIcons name="refresh" size={25} />
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            return null;
        }
    }
    _getAllItems() {
        AsyncStorage.getAllKeys((err, keys) => {
            let itemKeyList = []
            keys.map((result, i, key) => {
                if (_.startsWith(key[i], "ItemList."+this.state.alarmName)) {
                    itemKeyList.push(key[i]);
                }
            });
            if (this.state.changeAvailable || itemKeyList.length != this.state.itemCount) {
                AsyncStorage.multiGet(itemKeyList, (err, stores) => {
                    let itemViewList = [];
                    stores.map((result, i, store) => {
                        let key = store[i][0];
                        let value = store[i][1];
                        itemViewList.push(JSON.parse(value));
                    });
                    if (ds.cloneWithRows(itemViewList) != this.state.itemDataSource) {
                        this.setState({
                            itemDataSource: ds.cloneWithRows(itemViewList),
                            itemCount: itemViewList.length,
                            changeAvailable: false
                        });
                    }
                });
            }
        });
    }
    _navigateToItemAddScreen(alarm) {
        this.props.navigation.navigate('ItemCustomize', { alarm });
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
    componentDidMount() {
        DeviceEventEmitter.addListener('saveItem', (e)=>{
			this._getAllItems();
		});
        this._getAllItems();
    }
    render() {
        return (
            <ViewContainer style={{backgroundColor: "powderblue"}}>
                <StatusBarBackground/>
                <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps="handled">
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}>
                            <MaterialIcons name="navigate-before" size={40}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{marginTop: deviceHeight*0.015, marginLeft: deviceWidth*0.83}}
                            onPress={() => this._toggleEdit()}>
                            <MaterialIcons style={{fontSize: 17}} name="edit" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.alarmName}>{this.state.alarmName}</Text>
                    <Text style={[styles.instructions, {marginTop: deviceHeight*0.03}]}>Add an Item</Text>
                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: "lightgreen", marginTop: 0}]}
                        onPress={(event) => this._navigateToItemAddScreen(this.props.navigation.getParam('alarm'))}>
                        <MaterialIcons name="add" size={25} />
                    </TouchableOpacity>
                    <ListView
                        dataSource={this.state.itemDataSource}
                        enableEmptySections={true}
                        renderRow={(item) => {return this._renderItemRow(item)}} />
                    {this.state.itemCount === 0 ?
                        <Text style={[styles.instructions, {marginTop: deviceHeight*0.3}]}>You have no items.</Text>
                        : null
                    }
                </ScrollView>
            </ViewContainer>
        )
    }
    componentDidUpdate() {
        this._getAllItems();
    }
}

const styles = StyleSheet.create({
    instructions: {
        textAlign: "center",
        color: '#333333',
        marginBottom: deviceHeight*0.01,
        marginTop: deviceHeight*0.01
    },
    alarmName: {
        fontSize: 20,
        textAlign: "center"
    },
    button: {
        marginTop: deviceHeight*0.01,
        justifyContent: 'center',
        alignItems: 'center',
        height: deviceHeight*0.04
    },
    itemButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: deviceHeight*0.04,
        marginRight: deviceWidth*0.05,
        marginTop: deviceHeight*0.01
    }
});

module.exports = AlarmDetailsScreen
