import React, {Component} from 'react';
import {
  ScrollView,
  View,
  TouchableHighlight,
  Text,
  ActivityIndicator,
} from 'react-native';
import styles from '../../styles/connectStyles';

export default class ConnectView extends Component {
  render() {
    const {versionNumber} = this.props;
    return (
      <View style={styles.root}>
        <ScrollView style={styles.root} contentInset={{bottom: 90}}>
          {this.renderActivity()}
          {this.renderConnectButton()}
          <Text style={{marginTop: 20, color: 'gray', alignSelf: 'center'}}>
            version {versionNumber}
          </Text>
        </ScrollView>
      </View>
    );
  }

  renderActivity() {
    if (!this.props.connecting) {
      return null;
    }
    return (
      <ActivityIndicator
        animating={true}
        style={styles.activity}
        size="small"
      />
    );
  }

  renderConnectButton() {
    if (this.props.connecting) {
      return null;
    }
    const {onConnectPress} = this.props;
    return (
      <TouchableHighlight style={styles.connectButton} onPress={onConnectPress}>
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableHighlight>
    );
  }
}
