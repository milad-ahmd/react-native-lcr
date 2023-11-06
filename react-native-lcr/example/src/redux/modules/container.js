import {createActions, handleActions} from 'redux-actions';

export const {container: actions} = createActions({
  CONTAINER: {
    SET_LOADING_STATE: (container, state) => ({container, state}),
  },
});

const initialState = {};

export const reducer = handleActions(
  {
    [actions.setLoadingState]: (state, action) => {
      const {container} = action.payload;
      state[container] = action.payload.state;
      return {...state};
    },
  },
  initialState,
);
