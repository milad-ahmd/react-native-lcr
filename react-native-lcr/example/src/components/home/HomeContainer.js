import React, {Component} from 'react';
import {Alert, Button} from 'react-native';
import NavBarButton from '../../components/nav/NavBarButton';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import HomeView from './HomeView';
import {
  getCurrentDeviceSelector,
  actions as deviceActions,
} from '../../redux/modules/device';
import NavigationService from '../nav/NavigationService';
const {setSelectedDevice, getAvailableDevices} = deviceActions;

const refreshImage = require('../../assets/refresh-icon.png');

class HomeContainer extends Component {
  static navigationOptions = ({navigation}) => {
    const {dispatch} = navigation;
    return {
      headerLeft: null,
      headerRight: (
        <NavBarButton
          image={refreshImage}
          onPress={() => dispatch(getAvailableDevices('Home'))}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.canStartDelivery = this.canStartDelivery.bind(this);
  }

  componentWillMount() {
    const {availableDevices} = this.props;
    if (availableDevices.length === 0) {
      this.props.getAvailableDevices();
    }
  }

  canStartDelivery() {
    const {selectedDevice} = this.props;
    if (!selectedDevice) {
      Alert.alert('Please select a device.');
      return false;
    }
    if (!selectedDevice.selectedProduct()) {
      Alert.alert('Please select a product.');
      return false;
    }
    return true;
  }

  render() {
    const {
      selectedDevice,
      loadingState,
      availableDevices,
      getAvailableDevices,
      setSelectedDevice,
      navigation,
    } = this.props;
    const ticketPending =
      (selectedDevice && selectedDevice.deliveryCode.needsPrint()) || false;
    const selectedProduct = selectedDevice && selectedDevice.selectedProduct();
    return (
      <HomeView
        availableDevices={availableDevices}
        selectedDevice={selectedDevice}
        selectedProduct={selectedProduct}
        ticketPending={ticketPending}
        onDeviceRowPress={setSelectedDevice}
        onSelectPresetPress={() =>
          this.canStartDelivery() && navigation.navigate('SetDeliveryPreset')
        }
        onSelectProductPress={() => navigation.navigate('SelectProduct')}
        onManualDeliveryPress={() =>
          this.canStartDelivery() && navigation.navigate('Delivery')
        }>
        <LoadingOverlay
          onRetryPress={getAvailableDevices}
          loadingState={loadingState}
        />
        <Button
          title="Log page"
          onPress={() => NavigationService.navigate('Logs')}
        />
      </HomeView>
    );
  }
}

const mapStateToProps = state => {
  const {availableDevices} = state.device;
  return {
    loadingState: state.container.Home || {},
    selectedDevice: getCurrentDeviceSelector(state),
    availableDevices: Object.values(availableDevices),
  };
};

const mapDispatchToProps = dispatch => {
  const container = 'Home';
  return bindActionCreators(
    {
      setSelectedDevice: device => setSelectedDevice(container, device),
      getAvailableDevices: () => getAvailableDevices(container),
    },
    dispatch,
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
