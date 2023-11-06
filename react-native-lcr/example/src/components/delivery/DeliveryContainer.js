import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  getCurrentDeviceSelector,
  actions as deviceActions,
} from '../../redux/modules/device';
import {actions as containerActions} from '../../redux/modules/container';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import {bindActionCreators} from 'redux';
import DeliveryView from './DeliveryView';
import {CommandCode} from 'react-native-lcr';

const {issueCommand, refreshDeliveryData} = deviceActions;
const {setLoadingState} = containerActions;

class DeliveryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUnitIndex: 0,
      lastCommandSent: 'run',
    };
  }
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    const {title = ''} = params;
    return {title};
  };

  componentWillMount() {
    const {device, navigation, setLoadingState} = this.props;
    const preset = device.deliveringPreset();
    const title = preset ? 'PRESET DELIVERY' : 'MANUAL DELIVERY';
    navigation.setParams({title});
    // refreshDeliveryData();

    setLoadingState({});
  }

  retryButtonPressed() {
    this.sendCommand(this.state.lastCommandSent);
  }

  sendCommand(command) {
    const {
      sendPauseCommand,
      sendRunCommand,
      sendPrintCommand,
      refreshDeliveryData,
    } = this.props;
    this.setState({...this.state, lastCommandSent: command});
    if (command === 'pause') {
      clearInterval(this.interval);
      sendPauseCommand();
      setTimeout(() => {
        refreshDeliveryData();
      }, 1000);
    } else if (command === 'run') {
      sendRunCommand();
      this.interval = setInterval(() => {
        refreshDeliveryData();
      }, 1000);
    } else if (command === 'print') {
      clearInterval(this.interval);
      sendPrintCommand();
      setTimeout(() => {
        refreshDeliveryData();
      }, 1000);
    }
  }

  render() {
    const {device, loadingState} = this.props;
    const {deliveryCode} = device;
    const {selectedUnitIndex} = this.state;
    const volumeSelected = selectedUnitIndex === 0;
    const preset = volumeSelected
      ? device.formattedPresetValue()
      : device.formattedPricePresetValue();
    const delivered = volumeSelected
      ? device.formattedQuantity()
      : device.formattedCalculatedTotalDue();
    if (parseInt(delivered) === parseInt(preset)) {
      clearInterval(this.interval);
      setTimeout(() => {
        refreshDeliveryData();
      }, 1000);
    }
    return (
      <DeliveryView
        preset={preset}
        delivered={delivered}
        flowRate={device.formattedFlowRate()}
        flowing={deliveryCode.flowing}
        printEnabled={!deliveryCode.needsPrint()}
        selectedUnitIndex={selectedUnitIndex}
        onSelectUnit={selectedUnitIndex => this.setState({selectedUnitIndex})}
        onPrintPress={() => this.sendCommand('print')}
        onStopPress={() => this.sendCommand('pause')}
        onRunPress={() => this.sendCommand('run')}>
        <LoadingOverlay
          onRetryPress={this.retryButtonPressed}
          loadingState={loadingState}
        />
      </DeliveryView>
    );
  }
}

const mapStateToProps = state => {
  const device = getCurrentDeviceSelector(state);
  return {
    lastUpdate: new Date(),
    loadingState: state.container.Delivery || {},
    device,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setLoadingState: args => setLoadingState('Delivery', args),
      sendRunCommand: () => issueCommand('Delivery', CommandCode.StartResume),
      sendPrintCommand: () => issueCommand('Delivery', CommandCode.Print),
      sendPauseCommand: () => issueCommand('Delivery', CommandCode.Pause),
      refreshDeliveryData,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryContainer);
