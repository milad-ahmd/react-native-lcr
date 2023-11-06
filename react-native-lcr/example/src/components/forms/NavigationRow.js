import React, {Component} from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import styles from '../../styles/sharedStyles';

export default class NavigationRow extends Component {
  render() {
    const {title, onPress, isEnabled} = this.props;
    return (
      <TouchableHighlight onPress={onPress}>
        <View style={styles.selection}>
          <Text
            style={[
              styles.selectionLeft,
              isEnabled ? styles.active : styles.inactive,
            ]}>
            {title}
          </Text>
          <Text
            style={[
              styles.selectionRight,
              isEnabled ? styles.active : styles.inactive,
            ]}>
            {'Select >'}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}
