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
    AsyncStorage,
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
                if (_.startsWith(key[i], "ItemList."+this.props.alarm.alarmName)) {
                    itemKeyList.push(key[i]);
                }
            });
            AsyncStorage.multiRemove(itemKeyList);
        });
        this.props.navigator.pop();
    }
    _renderItemRow(item) {
        if (item) {
            return (
                <View style={{marginLeft: 20, marginTop: 5}}>
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
                if (_.startsWith(key[i], "ItemList."+this.props.alarm.alarmName)) {
                    itemKeyList.push(key[i]);
                }
            });
            AsyncStorage.multiGet(itemKeyList, (err, stores) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
                let itemViewList = [];
                stores.map((result, i, store) => {
                    let key = store[i][0];
                    let value = store[i][1];
                    itemViewList.push(JSON.parse(value));
                });
                this.setState({
                    itemDataSource: ds.cloneWithRows(itemViewList)
                });
            });
        });
    }
    render() {
        return (
            <ViewContainer style={{backgroundColor: "powderblue"}}>
                <StatusBarBackground/>
                <ScrollView>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Icon name="chevron-left" size={30} />
                    </TouchableOpacity>
                    <Text style={styles.alarmName}>{`${_.capitalize(this.props.alarm.alarmName)}`}</Text>
                    <ListView
                        style={{height: 415}}
                        dataSource={this.state.itemDataSource}
                        enableEmptySections={true}
                        renderRow={(item) => {return this._renderItemRow(item)}} />
                    <TouchableElement
                        style={styles.button}
                        onPress={this._deleteAlarm}>
                        <Icon name="times" size={25} />
                    </TouchableElement>
                </ScrollView>
            </ViewContainer>
        )
    }
    componentWillReceiveProps(nextProps) {
        this._getAllItems();
    }
}

const styles = StyleSheet.create({
    alarmName: {
        marginTop: 100,
        fontSize: 20,
        textAlign: "center",
        marginBottom: 5
    },
    button: {
        backgroundColor: "pink",
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },
});

module.exports = AlarmDetailsScreen
