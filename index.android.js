'use strict'
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    DrawerLayoutAndroid
} from 'react-native';
import AppNavigator from './app/navigation/AppNavigator'
import Icon from 'react-native-vector-icons/FontAwesome'

class CountAlarm extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     selectedTab: "AlarmIndex"
        // }
        this.openDrawer = this.openDrawer.bind(this);
    }
    openDrawer() {
        this.refs['DRAWER'].openDrawer()
    }
    render() {
        let navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <AppNavigator initialRoute={{id: "AlarmCreate"}} />
            </View>
        );
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                ref={'DRAWER'}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => navigationView}>
                <AppNavigator initialRoute={{id: "AlarmIndex"}} />
            </DrawerLayoutAndroid>
        )
    }

}

const styles = StyleSheet.create({
  navigatorStyles: {

  }
});

AppRegistry.registerComponent('CountAlarm', () => CountAlarm);