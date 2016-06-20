'use strict'
import React, { Component } from 'react';
import {
    StyleSheet,
    Navigator,
    Text
} from 'react-native';
import AlarmIndexScreen from '../screens/AlarmIndexScreen'
import AlarmDetailsScreen from '../screens/AlarmDetailsScreen'
import AlarmCreateScreen from '../screens/AlarmCreateScreen'

class AppNavigator extends Component {
    _renderScene(route, navigator) {
        let globalNavigatorProps = {
            navigator: navigator
        };
        switch(route.id) {
            case "AlarmIndex":
                return (
                   <AlarmIndexScreen {...globalNavigatorProps} />
                )
            case "AlarmDetails":
                navigator.pop();
                return (
                    <AlarmDetailsScreen {...globalNavigatorProps}
                    alarm={route.alarm} />
                )
            case "AlarmCreate":
                return (
                    <AlarmCreateScreen {...globalNavigatorProps} />
                )
            default:
                return (
                    <Text>Messed Up {route}</Text>
                )
        }
    }
    render() {
        return (
            <Navigator
                initialRoute={this.props.initialRoute}
                ref="appNavigator"
                style={styles.navigatorStyles}
                renderScene={this._renderScene}
                configureScene={(route) => ({
                    ...route.sceneConfig || Navigator.SceneConfigs.FloatFromRight
            })} />
        )
    }
}

const styles = StyleSheet.create({
  navigatorStyles: {

  }
});

module.exports = AppNavigator
