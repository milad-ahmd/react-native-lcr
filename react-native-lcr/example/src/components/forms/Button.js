import React, {Component} from 'react';
import {TouchableHighlight, Text, View} from 'react-native';
import styles from '../../styles/sharedStyles';

export default class Button extends Component {
  render() {
    const {onPress, title} = this.props;
    return (
      <TouchableHighlight onPress={onPress}>
        <View style={styles.continueButton}>
          <Text style={[styles.text, styles.continueButtonText]}>{title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
