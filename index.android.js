/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
// 'use strict';

import React, { Component } from 'react';
import {
  Platform,
  StatusBar,
  Navigator,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  TouchableNativeFeedback,
  TextInput
} from 'react-native';
import Firebase from 'firebase';

class CountAlarm extends Component {
  constructor(props) {
    super(props);
    let fireDB = new Firebase('https://boiling-inferno-9520.firebaseio.com');

    fireDB.set({
      title: "Hello World",
      author: "Andrew An"
    });
  }
  render() {
    return (
      <View>
        <StatusBar
         backgroundColor="grey"
         barStyle="light-content"
        />
        <Navigator
         initialRoute={{statusBarHidden: false}}
         renderScene={(route, navigator) =>
           <View>
             <StatusBar hidden={route.statusBarHidden} />
           </View>
         }
        />
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to Count Alarm!
          </Text>
          <Text style={styles.instructions}>
            This alarm notifies you when something is running out.
          </Text>
          <Text style={styles.instructions}>
            ex) Running low on socks! Go do your laundry!
          </Text>
        </View>
      </View>
    );
  }
}

class addAlarm extends Component {
  constructor() {
    super();
    this.buttonClicked = this.buttonClicked.bind(this);
  }
  buttonClicked() {
    console.log('button clicked');
  }
  render() {
    let TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
     TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View style={styles.container}>
        <TouchableElement
          style={styles.button}
          onPress={this.buttonClicked}>
          <View>
            <Text style={styles.buttonText}>Add</Text>
          </View>
        </TouchableElement>        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('CountAlarm', () => CountAlarm);
