import {createActions, handleActions} from 'redux-actions';
import {select, call, takeEvery, put, all} from 'redux-saga/effects';
import { issueCommandRequest,
  getFieldDataRequest,
  getDeliveryStatusRequest,
  setFieldDataRequest,
  DeliveryCode,
  Device,
  Product,
  streamQueue
} from 'react-native-lcr';
import {actions as containerActions} from '../../redux/modules/container';

const {queue} = streamQueue;

const {setLoadingState} = containerActions;
import NavigationService from '../../components/nav/NavigationService';

export const {device: actions} = createActions({
  DEVICE: {
    GET_FIELD_DATA: (container, fields) => ({container, fields}),
    SET_FIELD_DATA: (container, field, localValue, data) => ({
      container,
      field,
      localValue,
      data,
    }),
    ISSUE_COMMAND: (container, command) => ({container, command}),
    SET_ACTIVE_POS_PRODUCT: (container, product) => ({container, product}),
    SET_ACTIVE_PRODUCT: (container, product) => ({container, product}),
    GET_DELIVERY_STATUS: container => ({container}),
    CLEAR_DELIVERY_PRESETS: null,
    SET_DELIVERY_PRESET: (container, isPricePreset, value) => ({
      container,
      isPricePreset,
      value,
    }),
    REFRESH_DELIVERY_DATA: null,
    GET_AVAILABLE_PRODUCTS: container => ({container}),
    UPDATE_DEVICE: device => ({device}),
    SET_SELECTED_DEVICE: (container, device) => ({container, device}),
    SET_AVAILABLE_DEVICES: devices => ({devices}),
    GET_AVAILABLE_DEVICES: container => ({container}),
  },
});

export const initialState = {
  availableDevices: {},
  selectedDeviceAddress: null,
};

export const reducer = handleActions(
  {
    [actions.setSelectedDevice]: (state, action) => {
      const selectedDeviceAddress = action.payload.device.address;
      return {
        ...state,
        selectedDeviceAddress,
      };
    },

    [actions.setAvailableDevices]: (state, action) => {
      const availableDevices = action.payload.devices;
      return {
        ...state,
        availableDevices,
      };
    },

    [actions.updateDevice]: (state, action) => {
      const {device} = action.payload;
      const {availableDevices} = state;
      availableDevices[device.address] = device;
      return {
        ...state,
        availableDevices,
      };
    },
  },
  initialState,
);

export const getCurrentDeviceSelector = ({
  device: {availableDevices, selectedDeviceAddress},
}) => availableDevices[selectedDeviceAddress];

export function* setDeliveryPresetSaga(action) {
  const {isPricePreset, value} = action.payload;
  const device = yield select(getCurrentDeviceSelector);

  const field = isPricePreset ? device.pricePreset : device.activePresetField();
  field.value = value;
  yield call(_setFieldData, device, field);
  NavigationService.navigate('Delivery');
}

export function* clearDeliveryPresetsSaga() {
  const device = yield select(getCurrentDeviceSelector);
  yield call(_clearDeliveryPresetsSaga, device);
  yield put(actions.updateDevice(device));
}

export function* getFieldDataSaga(action) {
  const {fields} = action.payload;
  const device = yield select(getCurrentDeviceSelector);

  for (let field of fields) {
    yield call(_getFieldData, device, field);
  }
  yield put(actions.updateDevice(device));
}

export function* setFieldDataSaga(action) {
  const {field} = action.payload;
  const device = yield select(getCurrentDeviceSelector);
  yield call(_setFieldData, device, field);
}

export function* setActiveProductSaga(action) {
  const {product} = action.payload;
  const device = yield select(getCurrentDeviceSelector);

  device.activeProductNumber.value = product.number;
  yield call(_setFieldData, device, device.activeProductNumber);
  yield call(_getFieldData, device, device.compensationType);
  NavigationService.goBack();
}

export function* setActivePosProductSaga(action) {
  const {product} = action.payload;
  const device = yield select(getCurrentDeviceSelector);

  //set pos product number
  device.activePOSProductNumber.value = product;
  yield call(_setFieldData, device, device.activePOSProductNumber);

  //get the calibration from the pos product
  yield call(_getFieldData, device, device.activePOSProductCalibration);

  //set the active product to the calibration
  device.activeProductNumber.value = device.activePOSProductCalibration.value;
  yield call(_setFieldData, device, device.activeProductNumber);

  //get the name of the product
  yield call(_getFieldData, device, device.activePOSProductName);
  device.products[product] = new Product(
    product,
    device.activePOSProductName.value,
  );

  //get compensation type of product
  yield call(_getFieldData, device, device.compensationType);
  yield put(actions.updateDevice(device));
  NavigationService.goBack();
}

export function* issueCommandSaga(action) {
  const {command} = action.payload;
  const device = yield select(getCurrentDeviceSelector);
  const request = issueCommandRequest(device.address, command);
  yield call(queue, request);
  // yield call(delay, 1000);
  // yield delay(1000);
  yield call(_getDeliveryStatus, device);
  yield put(actions.updateDevice(device));
}

export function* getDeliveryStatusSaga() {
  const device = yield select(getCurrentDeviceSelector);
  yield call(_getDeliveryStatus, device);
  yield put(actions.updateDevice(device));
}

export function* refreshDeliveryDataSaga() {
  let device = yield select(getCurrentDeviceSelector);
  // while (!device.deliveryCode.finished) {
  //   try {
  //     device = yield select(getCurrentDeviceSelector);

  //     yield call(_getFieldData, device, device.activeQuantityField());
  //     // yield call(_getFieldData, device, device.calculatedTotalDue);
  //     yield call(_getFieldData, device, device.currentFlowRate);
  //     yield call(_getDeliveryStatus, device);
  //     yield put(actions.updateDevice(device));
  //     console.log('device.deliveryCode.finished', device.deliveryCode.finished);
  //     if (device.deliveryCode.finished) {
  //       console.log('human readability of deliveryStatus', device.deliveryCode);
  //       device.deliveryCode.finished = false;
  //       yield call(_clearDeliveryPresetsSaga, device);
  //       yield put(actions.updateDevice(device));
  //       NavigationService.navigate('Home');
  //     } else {
  //       yield put(actions.updateDevice(device));
  //     }
  //   } catch (error) {
  //     console.log('Error:', error);
  //   }
  // }
  try {
    yield call(_getFieldData, device, device.activeQuantityField());
    // yield call(_getFieldData, device, device.calculatedTotalDue);
    yield call(_getFieldData, device, device.currentFlowRate);
    yield call(_getDeliveryStatus, device);
    yield put(actions.updateDevice(device));
    console.log('device.deliveryCode.finished', device.deliveryCode.finished);
    if (device.deliveryCode.finished) {
      console.log('human readability of deliveryStatus', device.deliveryCode);
      device.deliveryCode.finished = false;
      yield call(_clearDeliveryPresetsSaga, device);
      yield put(actions.updateDevice(device));
      NavigationService.navigate('Home');
    } else {
      yield put(actions.updateDevice(device));
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

export function* getAvailableDevicesSaga() {
  yield put(actions.setAvailableDevices({}));
  const addresses = [250];
  let devices = {};
  for (const address of addresses) {
    const device = new Device(address);
    try {
      yield call(_getDeliveryStatus, device, true);
      devices[device.address] = device;
      yield put(actions.setAvailableDevices(devices));
    } catch (error) {
      console.log('error in getAvailableDevicesSaga: ', error);
    }
  }
  const {availableDevices} = yield select(({device}) => device);
  if (availableDevices.length == 0) {
    throw 'No registers found';
  }
}

export function* getAvailableProductsSaga() {
  const device = yield select(getCurrentDeviceSelector);
  device.products = {};
  yield put(actions.updateDevice(device));

  for (var i = 0; i < 4; i++) {
    device.activeProductNumber.value = i;
    yield call(_setFieldData, device, device.activeProductNumber);
    yield call(_getFieldData, device, device.pulsesPerUnit);

    if (device.pulsesPerUnit.value == 0) {
      continue;
    }
    yield call(_getFieldData, device, device.activeProductDescriptor);
    let product = new Product(i, device.activeProductDescriptor.value);
    device.products[i] = product;
    // prevent the product from looking like it's selected during fetch
    device.activeProductNumber.value = null;
    yield put(actions.updateDevice(device));
  }
}

export function* setSelectedDeviceSaga(action) {
  const {device} = action.payload;
  const {
    purchasedFeatures,
    volumeDecimalPlaces,
    grossPreset,
    netPreset,
    pricePreset,
  } = device;
  yield call(_getFieldData, device, purchasedFeatures);
  yield call(_getFieldData, device, volumeDecimalPlaces);

  yield put.resolve(actions.updateDevice(device));

  if (device.deliveryCode.active) {
    yield call(_getFieldData, device, grossPreset);
    yield call(_getFieldData, device, netPreset);
    yield call(_getFieldData, device, pricePreset);
    NavigationService.navigate('Delivery');
  }
}

//Private

function* _clearDeliveryPresetsSaga(device) {
  const quantityPreset = device.activePresetField();
  quantityPreset.value = 0;
  device.pricePreset.value = 0;
  yield call(_setFieldData, device, quantityPreset);
  yield call(_setFieldData, device, device.pricePreset);
}

export function* _setFieldData(device, field) {
  const expected = field.value;
  field.value = expected;
  const request = setFieldDataRequest(device.address, field);
  yield call(queue, request);
  yield call(_getFieldData, device, field);
  if (field.value != expected) {
    throw 'failed to set field value';
  }
}

export function* _getFieldData(device, field) {
  const request = getFieldDataRequest(device.address, field);
  const response = yield call(queue, request);
  if (response != null) {
    field.value = response.value;
  }
}

export function* _getDeliveryStatus(device, ignore) {
  const prevDeliveryCode = device.deliveryCode || {};
  const request = getDeliveryStatusRequest(device.address, ignore);
  const response = yield call(queue, request);
  device.deliveryCode = new DeliveryCode(response.delCode, prevDeliveryCode);
  console.log(
    '* human readability of delivery status====>',
    device.deliveryCode,
  );
}

function* fetchSaga(loadingText, saga, action) {
  let {container} = action.payload || {};
  if (loadingText == '' || !container) {
    container = 'ignore';
  }
  yield put(setLoadingState(container, {loading: loadingText}));

  try {
    yield call(saga, action);
    yield put(setLoadingState(container, {}));
  } catch (error) {
    yield put(
      setLoadingState(container, {error: error.toString(), retry: action}),
    );
  }
}

export const saga = function* () {
  const {
    setDeliveryPreset,
    clearDeliveryPresets,
    setSelectedDevice,
    getFieldData,
    setFieldData,
    setActiveProduct,
    setActivePosProduct,
    issueCommand,
    getDeliveryStatus,
    refreshDeliveryData,
    getAvailableDevices,
    getAvailableProducts,
  } = actions;

  yield all([
    takeEvery(
      setDeliveryPreset,
      fetchSaga,
      'Setting preset',
      setDeliveryPresetSaga,
    ),
    takeEvery(
      clearDeliveryPresets,
      fetchSaga,
      'Clearing preset',
      clearDeliveryPresetsSaga,
    ),
    takeEvery(
      setSelectedDevice,
      fetchSaga,
      'Syncing with meter',
      setSelectedDeviceSaga,
    ),
    takeEvery(getFieldData, fetchSaga, 'Syncing with meter', getFieldDataSaga),
    takeEvery(setFieldData, fetchSaga, 'Updating the meter', setFieldDataSaga),
    takeEvery(
      setActiveProduct,
      fetchSaga,
      'Updating the meter',
      setActiveProductSaga,
    ),
    takeEvery(
      setActivePosProduct,
      fetchSaga,
      'Updating the meter',
      setActivePosProductSaga,
    ),
    takeEvery(
      issueCommand,
      fetchSaga,
      'Sending command to meter',
      issueCommandSaga,
    ),
    takeEvery(
      getDeliveryStatus,
      fetchSaga,
      'Syncing with meter',
      getDeliveryStatusSaga,
    ),
    takeEvery(refreshDeliveryData, fetchSaga, '', refreshDeliveryDataSaga),
    takeEvery(
      getAvailableDevices,
      fetchSaga,
      'Scanning for available meters',
      getAvailableDevicesSaga,
    ),
    takeEvery(
      getAvailableProducts,
      fetchSaga,
      'Getting products',
      getAvailableProductsSaga,
    ),
  ]);
};
