import {StackActions} from '@react-navigation/native';

import {navSelectors} from './selectors';
const {selectRoute} = navSelectors;
const {reset, navigate, goBack} = StackActions;

// using a normal `import` for the RootNavigator results
// in a weird import loop because every screen is imported
// in the navigator file. It ends (I think) with the nav
// duck not existing when screens are trying to import it,
// because the screens are being imported by the nav duck.
const getStateForAction = (action, state) => {
  return StackActions.getStateForAction(action, state);
};

export const initialState = () => {
  return null;
};

export const actions = {
  resetToHome: () =>
    reset({
      index: 1,
      actions: [
        navigate({routeName: 'Connect'}),
        navigate({routeName: 'Home'}),
      ],
    }),
  navigateToDelivery: () => navigate({routeName: 'Delivery'}),
  navigateToHome: () => navigate({routeName: 'Home'}),
  navigateToSetDeliveryPreset: () => navigate({routeName: 'SetDeliveryPreset'}),
  navigateToLogs: () => navigate({routeName: 'Logs'}),
  navigateToSelectProduct: () => navigate({routeName: 'SelectProduct'}),
  goBack: () => goBack(),
};

export const reducer = (state = initialState(), action) => {
  // const nextState = getStateForAction(action, state);

  // if (state && nextState) {
  //   const navigating = action.type == StackActions.NAVIGATE;
  //   const sameRoute = selectRoute(state) == selectRoute(nextState);
  //   if (navigating && sameRoute) {
  //     // accidental double-navigation somewhere.
  //     // return previous state
  //   }
  // }
  return state;
};
