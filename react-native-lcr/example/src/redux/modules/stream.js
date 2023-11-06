import {createActions, handleActions} from 'redux-actions';
import {takeEvery, put, take, all} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import { StreamStatus,streamQueue} from 'react-native-lcr';
import NavigationService from '../../components/nav/NavigationService';

export const initialState = {
  status: StreamStatus.Disconnected,
  logs: [],
};

export const {stream: actions} = createActions({
  STREAM: {
    CONNECT_TO_STREAM: null,
    SET_STREAM_STATUS: status => ({status}),
    LOG: log => ({log}),
  },
});

export const reducer = handleActions(
  {
    [actions.setStreamStatus]: (state, action) => {
      const {status} = action.payload;
      return {
        ...state,
        status,
      };
    },
    [actions.log]: (state, action) => {
      const {log} = action.payload;
      console.log(log);
      const logs = [...state.logs, `${log}`];
      return {
        ...state,
        logs,
      };
    },
  },
  initialState,
);

export function* setStreamStatusSaga(action) {
  const {status} = action.payload;
  if (status === StreamStatus.Connected) {
    NavigationService.navigate('Home');
    // yield put(NavigationService.navigate('Home'));
  }
}

export function* connectToStreamSaga() {
  yield put(actions.setStreamStatus(StreamStatus.Connecting));
  const channel = yield eventChannel(emitter => {
    streamQueue.connect('10.10.100.254',8899,emitter);
    return () => {};
  });
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

export function* saga() {
  yield all([
    takeEvery(actions.connectToStream, connectToStreamSaga),
    takeEvery(actions.setStreamStatus, setStreamStatusSaga),
  ]);
}
