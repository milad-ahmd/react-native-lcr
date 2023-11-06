/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Image, View} from 'react-native';
const dialImage = require('../../assets/dial.png');
const dialTopImage = require('../../assets/dial-top.png');

export default class SwitchView extends Component {
  render() {
    const {flowing} = this.props;
    const rotation = flowing ? '31 deg' : '0 deg';

    return (
      <View
        style={{
          backgroundColor: '#C6CBD4',
          height: 80,
          width: 100,
        }}>
        <Image
          source={dialImage}
          style={{
            height: 80,
            width: 100,
          }}
        />
        <Image
          source={dialTopImage}
          style={{
            height: 41,
            left: 29,
            position: 'absolute',
            transform: [{rotate: rotation}],
            top: 14,
            width: 71,
          }}
        />
      </View>
    );
  }
}
