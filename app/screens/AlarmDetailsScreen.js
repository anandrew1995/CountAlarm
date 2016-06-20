'use strict'
import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TouchableHighlight,
    TouchableNativeFeedback,
    AsyncStorage
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

class AlarmDetailsScreen extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
        this.state = {
            itemDataSource: ds.cloneWithRows([])
        }
        this._deleteAlarm = this._deleteAlarm.bind(this);
        this._getAllItems = this._getAllItems.bind(this);
        this._getAllItems();
    }
    _deleteAlarm() {
        AsyncStorage.removeItem("AlarmList."+this.props.alarm.alarmName);
        AsyncStorage.getAllKeys((err, keys) => {
            let itemKeyList = []
            keys.map((result, i, key) => {
                console.log(key[i])
                if (_.startsWith(key[i], "ItemList."+this.props.alarm.alarmName)) {
                    itemKeyList.push(key[i]);
                }
            });
            console.log(itemKeyList)
            AsyncStorage.multiRemove(itemKeyList);
        });
        this.props.navigator.pop();
    }
    _renderItemRow(item) {
        if (item) {
            return (
                <Text>{`${_.capitalize(item.itemName)} ${item.itemTotal}`}</Text>
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
                console.log(key[i])
                if (_.startsWith(key[i], "ItemList."+this.props.alarm.alarmName)) {
                    itemKeyList.push(key[i]);
                }
            });
            console.log(itemKeyList)
            AsyncStorage.multiGet(itemKeyList, (err, stores) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
                let itemViewList = [];
                stores.map((result, i, store) => {
                    let key = store[i][0];
                    let value = store[i][1];
                    itemViewList.push(JSON.parse(value));
                    console.log(itemViewList)
                });
                this.setState({
                    itemDataSource: ds.cloneWithRows(itemViewList)
                });
            });
        });
    }
    render() {
        let TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
         TouchableElement = TouchableNativeFeedback;
        }
        return (
            <ViewContainer style={{backgroundColor: "dodgerblue"}}>
                <StatusBarBackground/>
                <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                    <Icon name="chevron-left" size={30} />
                </TouchableOpacity>
                <Text style={{marginTop: 100, fontSize: 20}}>{`Alarm Details Screen`}</Text>
                <Text style={styles.alarmName}>{`${_.capitalize(this.props.alarm.alarmName)} ${_.capitalize(this.props.alarm.alarmType)}`}</Text>
                <TouchableElement
                    style={styles.button}
                    onPress={this._deleteAlarm}>
                    <Text>Delete</Text>
                </TouchableElement>
                <ListView 
                    dataSource={this.state.itemDataSource}
                    enableEmptySections={true}
                    renderRow={(item) => {return this._renderItemRow(item)}} />
            </ViewContainer>
        )
    }
    componentWillReceiveProps(nextProps) {
        this._getAllItems();
    }
}

const styles = StyleSheet.create({
    alarmName: {
        marginLeft: 25
    },
    button: {
        backgroundColor: "coral",
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },
});

module.exports = AlarmDetailsScreen
