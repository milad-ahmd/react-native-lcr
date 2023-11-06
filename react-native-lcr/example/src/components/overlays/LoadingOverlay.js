import React, {Component} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import styles from '../../styles/loadingOverlayStyles';

export default class LoadingOverlay extends Component {
  render() {
    const {loadingState, onRetryPress} = this.props;
    const {loading, error} = loadingState;
    const text = loading || error;
    const showRetry = onRetryPress && error;
    const hide = !loading && !error;
    return hide ? null : (
      <View style={styles.root}>
        <View style={styles.disablingView} />
        <View style={styles.barBackground}>
          <Text style={styles.label}>{text}</Text>
          {loading && <ActivityIndicator style={styles.activity} />}
          {showRetry && (
            <TouchableOpacity style={styles.button} onPress={onRetryPress}>
              <Text style={styles.buttonTitle}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
