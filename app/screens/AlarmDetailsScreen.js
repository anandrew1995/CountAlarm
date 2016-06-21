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
    ScrollView
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import DB from '../database/DB';
import { DBEvents } from 'react-native-db-models'

let TouchableElement = TouchableHighlight;
if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
}

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});

class AlarmDetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemDataSource: ds.cloneWithRows([])
        }
        this._deleteAlarm = this._deleteAlarm.bind(this);
        this._getAllItems = this._getAllItems.bind(this);
        this._deductOne = this._deductOne.bind(this);
    }
    _deleteAlarm() {
        DB.AlarmList.remove({alarmName: this.props.alarm.alarmName});
        DB.ItemList.remove({alarmName: this.props.alarm.alarmName});
        this.props.navigator.pop();
    }
    _addOne(item) {
        if (item.currentAmount < item.itemTotal) {
            let itemDetail = {
                currentAmount: item.currentAmount+1
            };
            DB.ItemList.update({alarmName: this.props.alarm.alarmName, itemName: item.itemName}, itemDetail);
        }
    }
    _deductOne(item) {
        if (item.currentAmount > 0) {
            let itemDetail = {
                currentAmount: item.currentAmount-1
            };
            DB.ItemList.update({alarmName: this.props.alarm.alarmName, itemName: item.itemName}, itemDetail);
        }
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
                    <TouchableElement
                        style={styles.addButton}
                        onPress={() => {
                            this._addOne(item);
                        }}>
                        <Text>Add 1</Text>
                    </TouchableElement>
                    <TouchableElement
                        style={styles.deductButton}
                        onPress={() => {
                            this._deductOne(item);
                        }}>
                        <Text>Deduct 1</Text>
                    </TouchableElement>
                </View>
            )
        }
        else {
            return null;
        }
    }
    _getAllItems() {
        DB.ItemList.get_all((result) => {
            this.setState({
                itemDataSource: ds.cloneWithRows(result.rows)
            });
        });
    }
    render() {
        DBEvents.on("all", () => {
            this._getAllAlarms();
        });
        return (
            <ViewContainer style={{backgroundColor: "powderblue"}}>
                <StatusBarBackground/>
                <ScrollView>
                    <TouchableOpacity
                        onPress={() => this.props.navigator.pop()}>
                        <Icon name="chevron-left" size={30} />
                    </TouchableOpacity>
                    <Text style={styles.alarmName}>{`${_.capitalize(this.props.alarm.alarmName)}`}</Text>
                    <ListView
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
}

const styles = StyleSheet.create({
    alarmName: {
        marginTop: 20,
        fontSize: 20,
        textAlign: "center",
        marginBottom: 5
    },
    button: {
        marginTop: 40,
        backgroundColor: "pink",
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },
    addButton: {
        backgroundColor: "aliceblue",
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        marginRight: 20,
        marginTop: 5
    },
    deductButton: {
        backgroundColor: "lavenderblush",
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        marginRight: 20,
        marginTop: 5
    },
});

module.exports = AlarmDetailsScreen
