'use strict'
import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  StyleSheet,
  TouchableOpacity,
  Navigator
} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import StatusBarBackground from '../components/StatusBarBackground';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

const alarms = [
  {alarmName: "laundry", alarmType: "Deductible"},
  {alarmName: "morning", alarmType: "Time"},
  {alarmName: "sleep", alarmType: "Time"}
]

class AlarmIndexScreen extends Component {
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
    this.state = {
      alarmDataSource: ds.cloneWithRows(alarms)
    }
  }
  _navigateToAlarmDetails(alarm) {
    this.props.navigator.push({
      id: "AlarmDetails",
      alarm: alarm,
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    })
  }
  _renderAlarmRow(alarm) {
    return (
      <TouchableOpacity style={styles.alarmRow} onPress={(event) => this._navigateToAlarmDetails(alarm)}>
        <Text style={styles.alarmName}>{`${_.capitalize(alarm.alarmName)}`}</Text>
        <View style={{flex: 1}} />
        <Icon name="chevron-right" size={10} style={styles.alarmDetailsIcon}/>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <ViewContainer>
        <StatusBarBackground style={{backgroundColor: "mistyrose"}}/>
        <ListView 
          style={{marginTop: 100}}
          dataSource={this.state.alarmDataSource}
          renderRow={(alarm) => {return this._renderAlarmRow(alarm)}} />
      </ViewContainer>
    )
  }
  // componentDidMount() {
  //   AsyncStorage.getItem("myKey").then((value) => {
  //     this.setState({
  //       "myKey": value
  //     });
  //   }).done();
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  alarmRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 50
  },
  alarmName: {
    marginLeft: 25
  },
  alarmDetailsIcon: {
    color: "green",
    height: 20,
    width: 20,
    marginRight: 25

  }
});

module.exports = AlarmIndexScreen