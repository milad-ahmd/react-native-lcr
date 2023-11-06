import React, {Component} from 'react';
import {connect} from 'react-redux';
import ConnectContainer from '../../components/connect/ConnectContainer';
import HomeContainer from '../../components/home/HomeContainer';
import SelectProductContainer from '../../components/selectProduct/SelectProductContainer';
import DeliveryContainer from '../../components/delivery/DeliveryContainer';
import SetDeliveryPresetContainer from '../../components/setDeliveryPreset/SetDeliveryPresetContainer';
import LogsContainer from '../../components/logs/LogsContainer';
import {navigationRef} from './NavigationService';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

// export const Navigator = StackNavigator(
//   {
//     Connect: {
//       screen: ConnectContainer,
//       navigationOptions: {
//         title: 'WIFI SETUP',
//       },
//     },
//     Logs: {
//       screen: LogsContainer,
//       navigationOptions: {
//         title: 'WIFI LOGS',
//       },
//     },
//     Home: {
//       screen: HomeContainer,
//       navigationOptions: {
//         title: 'LIQUID CONTROLS',
//       },
//     },
//     SelectProduct: {
//       screen: SelectProductContainer,
//       navigationOptions: {
//         title: 'SELECT PRODUCT',
//       },
//     },
//     Delivery: {
//       screen: DeliveryContainer,
//     },
//     SetDeliveryPreset: {
//       screen: SetDeliveryPresetContainer,
//       navigationOptions: {
//         title: 'SET DELIVERY PRESET',
//       },
//     },
//   },
//   {
//     mode: 'modal',
//     navigationOptions: {
//       headerStyle: {
//         backgroundColor: '#000000',
//       },
//       headerTitleStyle: {
//         color: '#ffffff',
//       },
//       headerTintColor: '#fed100',
//     },
//   },
// );

class RootNavigator extends Component {
  render() {
    return (
      <NavigationContainer
        ref={navigationRef}
        navigation={{
          dispatch: this.props.dispatch,
          state: this.props.nav,
        }}>
        <Stack.Navigator
          navigation={{
            dispatch: this.props.dispatch,
            state: this.props.nav,
          }}
          initialRouteName="Connect">
          <Stack.Screen
            name="Connect"
            component={ConnectContainer}
            title="WIFI SETUP"
          />
          <Stack.Screen
            name="Logs"
            component={LogsContainer}
            title="WIFI LOGS"
          />
          <Stack.Screen
            name="Home"
            component={HomeContainer}
            title="LIQUID CONTROLS"
          />
          <Stack.Screen
            name="SelectProduct"
            component={SelectProductContainer}
            title="SELECT PRODUCT"
          />
          <Stack.Screen name="Delivery" component={DeliveryContainer} />
          <Stack.Screen
            name="SetDeliveryPreset"
            component={SetDeliveryPresetContainer}
            title="SET DELIVERY PRESET"
          />
        </Stack.Navigator>
      </NavigationContainer>
      // <Navigator navigation={addNavigationHelpers({dispatch, state: nav})} />
    );
  }
}
const mapStateToProps = ({nav}) => ({nav});
const mapDispatchToProps = dispatch => ({dispatch});
export default connect(mapStateToProps, mapDispatchToProps)(RootNavigator);
