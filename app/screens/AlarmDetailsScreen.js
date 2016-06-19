'use strict'
import React, { Component } from 'react';
import {
    Text,
    View,
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
        this._deleteAlarm = this._deleteAlarm.bind(this);
    }
    _deleteAlarm() {
        AsyncStorage.removeItem("AlarmList."+this.props.alarm.alarmName);
        this.props.navigator.pop();
    }
    render() {
        let TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
         TouchableElement = TouchableNativeFeedback;
        }
        return (
            <ViewContainer style={{backgroundColor: "dodgerblue"}}>
                <StatusBarBackground style={{backgroundColor: "mistyrose"}}/>
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
            </ViewContainer>
        )
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
