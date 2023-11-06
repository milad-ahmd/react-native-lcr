import React, {Component} from 'react';
import {AppRegistry, View, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import KeepAwake from 'react-native-keep-awake';
import RootNavigator from './nav/RootNavigator';
import configureStore from '../redux/configureStore';

const store = configureStore();

export default class Application extends Component {
  constructor(props) {
    super(props);
    KeepAwake.activate();
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <StatusBar barStyle="light-content" />
          <RootNavigator />
          {/*<ConnectionOverlay />*/}
        </View>
      </Provider>
    );
  }
}
AppRegistry.registerComponent('LcrExample', () => Application);
