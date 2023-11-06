import {put, select} from 'redux-saga/effects';
import {
  actions as deviceActions,
  setFieldDataSaga,
  getAvailableProductsSaga,
  getDeliveryStatusSaga,
  initialState,
  reducer,
  getCurrentDeviceSelector,
} from '../device';
import snapshotTestModule from './snapshotTestModule';
import Device from '~/models/Device';
import Product from '~/models/Product';
import Field from '~/models/Field';
import CommandCode from '~/models/CommandCode';
import {DecimalType} from '~/api/StreamResponse';
import StreamQueueStub from '~/api/__tests__/StreamQueueStub';

const {
  clearDeliveryPresets,
  setDeliveryPreset,
  refreshDeliveryData,
  getFieldData,
  setFieldData,
  issueCommand,
  setActivePosProduct,
  setActiveProduct,
  getDeliveryStatus,
  getAvailableProducts,
  updateDevice,
  setSelectedDevice,
  setAvailableDevices,
  getAvailableDevices,
} = deviceActions;

const container = 'container name';
const device1 = new Device(1);
const device2 = new Device(2);
const devices = [device1, device2];
const field1 = new Field(1, new DecimalType(4), 0);
const field2 = new Field(2, new DecimalType(4), 0);
const fields = [field1, field2];
const product = new Product(2, 'product name');
const queue = new StreamQueueStub();
const isPricePreset = true;

snapshotTestModule({
  name: 'device',
  reducer,
  actions: {
    clearDeliveryPresets: clearDeliveryPresets(),
    setDeliveryPreset: setDeliveryPreset(container, isPricePreset, 30),
    refreshDeliveryData: refreshDeliveryData(),
    setActiveProduct: setActiveProduct(container, 1),
    getFieldData: getFieldData(container, fields),
    setFieldData: setFieldData(container, field1, 10, 20),
    issueCommand: issueCommand(container, CommandCode.StartResume),
    setActivePosProduct: setActivePosProduct(container, product),
    getDeliveryStatus: getDeliveryStatus(container),
    getAvailableProducts: getAvailableProducts(container),
    updateDevice: updateDevice(device1),
    setSelectedDevice: setSelectedDevice(container, device1),
    setAvailableDevices: setAvailableDevices(devices),
    getAvailableDevices: getAvailableDevices(),
  },
  resetState: () => {
    return {...initialState, availableDevices: devices};
  },
});

describe('saga', () => {
  const container = 'Screen';
  const device = new Device(1);

  describe('#setFieldDataSaga', () => {
    const field = device.currentGrossQuantity;
    field.value = 10;
    const action = setFieldData(container, field);
    const saga = setFieldDataSaga(action);

    it('fetches the selected device', () => {
      let result = saga.next();
      expect(result.value).toEqual(select(getCurrentDeviceSelector));
    });

    it('executes the request to set remote data', () => {
      let result = saga.next(device);
      expect(result.value.CALL.fn.name).toEqual('_setFieldData');
      expect(result.value.CALL.args).toEqual([device, field]);
    });
  });

  describe('#getAvailableProductsSaga', () => {
    let action = getAvailableProducts(container);
    let saga = getAvailableProductsSaga(action);

    it('fetches the selected device', () => {
      let result = saga.next();
      expect(result.value).toEqual(select(getCurrentDeviceSelector));
    });

    it('clears the existing products', () => {
      let result = saga.next(device);
      expect(result.value).toEqual(put(updateDevice(device)));
    });

    it('includes products with a pulses per unit value greater than 0', () => {
      for (var i = 0; i < 2; i++) {
        let result = saga.next();
        expect(result.value.CALL.fn.name).toEqual('_setFieldData');
        expect(result.value.CALL.args).toEqual([
          device,
          device.activeProductNumber,
        ]);

        result = saga.next();
        expect(result.value.CALL.fn.name).toEqual('_getFieldData');
        expect(result.value.CALL.args).toEqual([device, device.pulsesPerUnit]);

        result = saga.next();
        expect(result.value.CALL.fn.name).toEqual('_getFieldData');
        expect(result.value.CALL.args).toEqual([
          device,
          device.activeProductDescriptor,
        ]);
        result = saga.next();
        expect(result.value).toEqual(put(updateDevice(device)));
      }
    });

    it('omits products with a pulses per unit of 0', () => {
      device.pulsesPerUnit.value = 0;
      for (var i = 0; i < 2; i++) {
        let result = saga.next();
        expect(result.value.CALL.fn.name).toEqual('_setFieldData');
        expect(result.value.CALL.args).toEqual([
          device,
          device.activeProductNumber,
        ]);
        result = saga.next();
        expect(result.value.CALL.fn.name).toEqual('_getFieldData');
        expect(result.value.CALL.args).toEqual([device, device.pulsesPerUnit]);
      }
    });
  });

  describe('#getDeliveryStatusSaga', () => {
    const action = getDeliveryStatus(container, device);
    const saga = getDeliveryStatusSaga(action);

    it('fetches the selected device', () => {
      let result = saga.next();
      expect(result.value).toEqual(select(getCurrentDeviceSelector));
    });

    it('gets the delivery status', () => {
      let result = saga.next(device);
      expect(result.value.CALL.fn.name).toEqual('_getDeliveryStatus');
      expect(result.value.CALL.args).toEqual([device]);
    });

    it('puts the updateDevice action', () => {
      let result = saga.next();
      expect(result.value).toEqual(put(updateDevice(device)));
    });
  });
});
