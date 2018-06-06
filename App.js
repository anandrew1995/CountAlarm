import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AlarmIndexScreen from './app/screens/AlarmIndexScreen'
import AlarmDetailsScreen from './app/screens/AlarmDetailsScreen'
import AlarmCreateScreen from './app/screens/AlarmCreateScreen'
import ItemCustomizeScreen from './app/screens/ItemCustomizeScreen'

export default class App extends React.Component {
    render() {
        return (
            <AppStackNavigator/>
        )
    }
}

const AppStackNavigator = createStackNavigator({
    AlarmIndex: AlarmIndexScreen,
    AlarmDetails: AlarmDetailsScreen,
    AlarmCreate: AlarmCreateScreen,
    ItemCustomize: ItemCustomizeScreen
})

const styles = StyleSheet.create({});
