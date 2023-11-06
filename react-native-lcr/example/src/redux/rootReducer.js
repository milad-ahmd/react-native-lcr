import {combineReducers} from 'redux';
import {reducer as device} from './modules/device';
import {reducer as container} from './modules/container';
import {reducer as stream} from './modules/stream';

const rootReducer = combineReducers({
  device,
  container,
  // nav,
  stream,
});

export default rootReducer;
