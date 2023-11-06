import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const configureStore = function (initialState = {}) {
  const loggerMiddleware = createLogger({
    collapsed: true,
    diff: true,
  });
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware, loggerMiddleware),
  );
  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;
