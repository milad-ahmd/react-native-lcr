import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  actions as deviceActions,
  getCurrentDeviceSelector,
} from '../../redux/modules/device';
import {actions as containerActions} from '../../redux/modules/container';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import SetDeliveryPresetView from './SetDeliveryPresetView';
const {setLoadingState} = containerActions;
const {clearDeliveryPresets, setDeliveryPreset} = deviceActions;

export class SetDeliveryPresetContainer extends Component {
  state = {
    selectedUnitIndex: 0,
  };

  constructor(props) {
    super(props);
    this.continueButtonPressed = this.continueButtonPressed.bind(this);
    this.retryButtonPressed = this.retryButtonPressed.bind(this);
  }

  componentWillMount() {
    this.props.setLoadingState({});
  }

  componentWillUnmount() {
    this.props.clearDeliveryPresets();
  }

  retryButtonPressed() {
    this.continueButtonPressed(this.state.presetValueText);
  }

  continueButtonPressed(presetValueText) {
    let numbersOnly = presetValueText.replace(',', '');
    const {setDeliveryPreset} = this.props;
    const {selectedUnitIndex} = this.state;
    const isPricePreset = selectedUnitIndex == 1;
    if (!isPricePreset) {
      // remove decimal point if it's a quantity preset
      numbersOnly = numbersOnly.replace('.', '');
    }

    setDeliveryPreset(isPricePreset, new Number(numbersOnly));
    this.setState({presetValueText});
  }

  render() {
    const {selectedUnitIndex} = this.state;
    const {
      loadingState,
      device: {volumeDecimalPlaces},
    } = this.props;
    return (
      <SetDeliveryPresetView
        onContinuePress={this.continueButtonPressed}
        onSelectUnit={selectedUnitIndex => this.setState({selectedUnitIndex})}
        selectedUnitIndex={selectedUnitIndex}
        volumeDecimalPlaces={volumeDecimalPlaces.value}>
        <LoadingOverlay
          loadingState={loadingState}
          onRetryPress={this.retryButtonPressed}
        />
      </SetDeliveryPresetView>
    );
  }
}

SetDeliveryPresetContainer.propTypes = {
  loadingState: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired,
  setLoadingState: PropTypes.func.isRequired,
  clearDeliveryPresets: PropTypes.func.isRequired,
  setDeliveryPreset: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    loadingState: state.container.SetDeliveryPreset || {},
    device: getCurrentDeviceSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  const container = 'SetDeliveryPreset';
  return bindActionCreators(
    {
      setLoadingState: args => setLoadingState(container, args),
      clearDeliveryPresets,
      setDeliveryPreset: (isPricePreset, value) =>
        setDeliveryPreset(container, isPricePreset, value),
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetDeliveryPresetContainer);
