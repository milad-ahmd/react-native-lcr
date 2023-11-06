import React, {Component} from 'react';
import {Text, View, ScrollView} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import PropTypes from 'prop-types';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import styles from '../../styles/sharedStyles';
import Button from '../../components/forms/Button';
import SelectableList from '../../components/forms/SelectableList';

export default class SetDeliveryPresetView extends Component {
  state = {
    inputText: '0',
  };

  render() {
    const {
      volumeDecimalPlaces,
      selectedUnitIndex,
      onSelectUnit,
      onContinuePress,
    } = this.props;
    const {inputText} = this.state;
    const volumeSelected = selectedUnitIndex == 0;
    const decimalPlaces = volumeSelected ? volumeDecimalPlaces : 2;
    return (
      <View style={[styles.root, {flex: 1, flexDirection: 'column'}]}>
        {this.props.children}

        <View keyboardShouldPersistTaps="always">
          <View style={styles.rowLabels}>
            <Text style={styles.rowLabel}>SELECT VOLUME OR DOLLAR AMOUNT</Text>
          </View>

          <SelectableList
            data={[{label: 'VOLUME'}, {label: 'DOLLAR AMOUNT'}]}
            onSelect={onSelectUnit}
            selectedIndex={selectedUnitIndex}
          />

          <View style={{...styles.rowLabels, marginTop: 30}}>
            <Text style={styles.rowLabel}>
              {volumeSelected ? 'ENTER VOLUME' : 'ENTER COST'}
            </Text>
          </View>

          <View style={styles.listView}>
            <View style={styles.row}>
              <Text style={{...styles.text, alignSelf: 'center'}}>
                {!volumeSelected && '$'}
              </Text>
              <TextInputMask
                style={{flex: 1}}
                options={{
                  unit: '',
                  delimiter: ',',
                  separator: '.',
                  precision: decimalPlaces,
                }}
                type={'money'}
                keyboardType="numeric"
                autoFocus={true}
                value={inputText}
                onChangeText={inputText => this.setState({inputText})}
              />
            </View>
          </View>

          {inputText != null && (
            <Button
              title="CONTINUE"
              onPress={() => onContinuePress(inputText)}
            />
          )}
          <KeyboardSpacer />
        </View>
      </View>
    );
  }
}

SetDeliveryPresetView.propTypes = {
  onContinuePress: PropTypes.func.isRequired,
  onSelectUnit: PropTypes.func.isRequired,
  selectedUnitIndex: PropTypes.number.isRequired,
  volumeDecimalPlaces: PropTypes.number.isRequired,
};
