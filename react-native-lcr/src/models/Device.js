import Field from './Field';
import DeliveryCode from './DeliveryCode';
import {DecimalType, FloatType, AsciiType} from '../api/StreamResponse';

export default class Device {
  constructor(address) {
    this.address = address;
    this.deliveryCode = new DeliveryCode([]);
    this.products = {};

    // fields
    this.activeProductNumber = new Field(0, new DecimalType(1));
    this.activeProductDescriptor = new Field(11, new AsciiType());
    this.activePOSProductName = new Field(198, new AsciiType());
    this.activePOSProductNumber = new Field(197, new DecimalType(2));
    this.activePOSProductCalibration = new Field(201, new DecimalType(1));

    this.currentGrossQuantity = new Field(2, new DecimalType(4), 0);
    this.currentNetQuantity = new Field(3, new DecimalType(4), 0);
    this.currentFlowRate = new Field(4, new DecimalType(4), 0);
    this.calculatedTotalDue = new Field(230, new FloatType(4), 0);

    this.grossPreset = new Field(5, new DecimalType(4), 0);
    this.netPreset = new Field(6, new DecimalType(4), 0);
    this.pricePreset = new Field(192, new FloatType(4), 0);

    this.compensationType = new Field(57, new DecimalType(1), 0);
    this.volumeDecimalPlaces = new Field(39, new DecimalType(1), 1);
    this.pulsesPerUnit = new Field(47, new DecimalType());
    this.purchasedFeatures = new Field(125, new DecimalType());
  }

  deliveringPreset() {
    return this.activePresetField().value > 0 || this.pricePreset.value > 0;
  }

  activeQuantityField() {
    if (this.compensationType.value > 0) {
      return this.currentNetQuantity;
    }
    return this.currentGrossQuantity;
  }

  activePresetField() {
    if (this.compensationType.value > 0) {
      return this.netPreset;
    }
    return this.grossPreset;
  }

  posEnabled() {
    if (this.purchasedFeatures.value == null) {
      return false;
    }
    return this.purchasedFeatures.value == 1;
  }

  selectedProduct() {
    if (this.posEnabled()) {
      let num = this.activePOSProductNumber.value;
      return this.products[num];
    }
    let num = this.activeProductNumber.value;
    return this.products[num];
  }

  formattedQuantity() {
    return this.formattedDecimalType(this.activeQuantityField().value || 0);
  }

  formattedPresetValue() {
    return this.formattedDecimalType(this.activePresetField().value || 0);
  }

  formattedFlowRate() {
    return this.formattedDecimalType(this.currentFlowRate.value || 0);
  }

  formattedCalculatedTotalDue() {
    let total = this.calculatedTotalDue.value || 0;
    return '$' + total.toFixed(2);
  }

  formattedPricePresetValue() {
    let preset = this.pricePreset.value || 0;
    return '$' + preset.toFixed(2);
  }

  formattedDecimalType(amount) {
    let decimalPlaces = this.volumeDecimalPlaces.value || 1;
    let decimalAmount = amount / (10 * decimalPlaces);
    return decimalAmount.toFixed(decimalPlaces);
  }
}
