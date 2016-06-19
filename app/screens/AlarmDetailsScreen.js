'use strict'
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  ListView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

class AlarmDetailsScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ViewContainer style={{backgroundColor: "dodgerblue"}}>
        <StatusBarBackground style={{backgroundColor: "mistyrose"}}/>
        <TouchableOpacity onPress={() => this.props.navigator.pop()}>
          <Icon name="times" size={30} />
        </TouchableOpacity>
        <Text style={{marginTop: 100, fontSize: 20}}>{`Alarm Details Screen`}</Text>
        <Text style={styles.alarmName}>{`${_.capitalize(this.props.alarm.alarmName)} ${_.capitalize(this.props.alarm.alarmType)}`}</Text>
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  alarmName: {
    marginLeft: 25
  }
});

module.exports = AlarmDetailsScreen
