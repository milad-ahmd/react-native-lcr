import React, {Component} from 'react';
import {Image, FlatList, Text, TouchableHighlight, View} from 'react-native';
import styles from '../../styles/sharedStyles';
import NavigationRow from '../../components/forms/NavigationRow';

export default class HomeView extends Component {
  constructor(props) {
    super(props);
    this.renderDeviceRow = this.renderDeviceRow.bind(this);
    this.renderSelected = this.renderSelected.bind(this);
    this.allowProductSelection = this.allowProductSelection.bind(this);
  }

  allowProductSelection() {
    let device = this.props.selectedDevice;
    return device != null; //&& device.posEnabled() != null;
  }

  render() {
    const {
      selectedProduct,
      ticketPending,
      onSelectProductPress,
      onManualDeliveryPress,
      onSelectPresetPress,
      availableDevices,
    } = this.props;

    const productSelectionText = (
      selectedProduct ? selectedProduct.name : 'Product Selection'
    ).toUpperCase();

    const deliveryEnabled = selectedProduct != null;
    const selectProductEnabled = this.allowProductSelection();
    const devicesData = availableDevices.map(device => ({
      key: device.address,
      device,
    }));
    return (
      <View style={styles.root}>
        {this.props.children}
        <View style={styles.devicesList}>
          <FlatList data={devicesData} renderItem={this.renderDeviceRow} />
        </View>

        <View style={styles.selections}>
          <NavigationRow
            isEnabled={selectProductEnabled}
            onPress={onSelectProductPress}
            title={productSelectionText}
          />
          {/* <NavigationRow
            isEnabled={deliveryEnabled}
            onPress={onManualDeliveryPress}
            title={'MANUAL DELIVERY'}
          /> */}
          <NavigationRow
            isEnabled={deliveryEnabled}
            onPress={onSelectPresetPress}
            title={'SELECT DELIVERY PRESET'}
          />
        </View>
      </View>
    );
  }

  renderDeviceRow({item: {device}}) {
    const {onDeviceRowPress} = this.props;
    const text =
      'Meter ' + device.address + ': ' + device.deliveryCode.description();
    return (
      <TouchableHighlight onPress={() => onDeviceRowPress(device)}>
        <View style={styles.row}>
          <Text style={[styles.text, styles.deviceText]}>{text}</Text>
          <Image
            source={require('../../assets/bolt.png')}
            style={styles.deviceImage}
          />
          <View style={{alignItems: 'flex-end', flex: 1, marginRight: 12}}>
            {this.renderSelected(device)}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderSelected(device) {
    const {selectedDevice} = this.props;
    if (!selectedDevice || selectedDevice.address != device.address) {
      return null;
    }
    return (
      <Image
        source={require('../../assets/checkmark.png')}
        style={styles.checkmark}
      />
    );
  }
}
