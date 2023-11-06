/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import styles from '../../styles/sharedStyles';
import SelectableList from '../../components/forms/SelectableList';

export default class DeliveryView extends PureComponent {
  render() {
    const {
      preset,
      flowing,
      delivered,
      onSelectUnit,
      onStopPress,
      onRunPress,
      flowRate,
      selectedUnitIndex,
      printEnabled,
      onPrintPress,
    } = this.props;
    const printButtonOpacity = printEnabled ? 1 : 0.5;
    let deliveredText = delivered;
    if (preset > 0) {
      deliveredText += ' / ' + preset;
    }

    return (
      <View style={{...styles.root, justifyContent: 'flex-start'}}>
        {this.props.children}

        <View style={styles.rowLabels}>
          <Text style={styles.rowLabel}>SELECT VOLUME OR DOLLAR AMOUNT</Text>
        </View>
        <SelectableList
          data={[{label: 'VOLUME'}, {label: 'DOLLAR AMOUNT'}]}
          onSelect={onSelectUnit}
          selectedIndex={selectedUnitIndex}
        />
        <View style={{...styles.rowLabels, marginTop: 30}}>
          <Text style={styles.rowLabel}>AMOUNT</Text>
          <Text style={styles.rowLabel}>FLOW RATE</Text>
        </View>
        <View style={styles.listView}>
          <View style={styles.row}>
            <Text
              style={
                flowing ? styles.deliveryTextUpdating : styles.deliveryText
              }>
              {deliveredText}
            </Text>

            <Text style={styles.deliveryText}>{flowRate}</Text>
          </View>
        </View>

        {!flowing && (
          <Text style={styles.warningText}>
            {'IS THE REGISTER SWITCH IN RUN POSITION?'}
          </Text>
        )}

        <View style={styles.deliveryButtons}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <TouchableHighlight
              onPress={onPrintPress}
              style={[styles.printButton, {opacity: printButtonOpacity}]}>
              <Text style={styles.printButtonText}>PRINT</Text>
            </TouchableHighlight>

            {flowing ? (
              <TouchableHighlight
                onPress={onStopPress}
                style={styles.runButtonInactive}>
                <Text style={styles.runButtonTextInactive}>STOP</Text>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight onPress={onRunPress} style={styles.runButton}>
                <Text style={styles.runButtonText}>RUN</Text>
              </TouchableHighlight>
            )}
          </View>
        </View>
      </View>
    );
  }
}
