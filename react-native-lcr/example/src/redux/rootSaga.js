import {saga as device} from './modules/device';
import {saga as stream} from './modules/stream';
import {all} from 'redux-saga/effects';

export default function* saga() {
  yield all([device(), stream()]);
}
