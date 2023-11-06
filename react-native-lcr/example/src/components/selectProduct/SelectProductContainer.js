import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  actions as deviceActions,
  getCurrentDeviceSelector,
} from '../../redux/modules/device';
import {Button} from 'react-native';
import {actions as containerActions} from '../../redux/modules/container';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import SelectProductView from './SelectProductView';
const {setLoadingState} = containerActions;
const {getAvailableProducts, setActivePosProduct, setActiveProduct} =
  deviceActions;

class SelectProductContainer extends Component {
  constructor(props) {
    super(props);
    this.retryButtonPressed = this.retryButtonPressed.bind(this);
    this.continueButtonPressed = this.continueButtonPressed.bind(this);
  }

  componentWillMount() {
    const {device, getAvailableProducts, products} = this.props;
    console.log(products);
    if (!device.posEnabled() && products.length === 0) {
      getAvailableProducts();
    }
  }

  retryButtonPressed() {
    const {device, getAvailableProducts} = this.props;
    if (device.posEnabled()) {
      this.continueButtonPressed(this.state.inputText);
    } else {
      getAvailableProducts();
    }
  }

  continueButtonPressed(inputText) {
    const {setActivePosProduct} = this.props;
    this.setState({inputText});
    if (inputText) {
      const productNum = new Number(inputText);
      setActivePosProduct(productNum);
    }
  }

  render() {
    const {device, products, setActiveProduct, loadingState} = this.props;
    return (
      <SelectProductView
        products={products}
        selectedProduct={device.selectedProduct()}
        posEnabled={device.posEnabled()}
        onSelectProductRow={setActiveProduct}
        onPressContinue={this.continueButtonPressed}>
        <LoadingOverlay
          onRetryPress={this.retryButtonPressed}
          loadingState={loadingState}
        />
        {products.length > 0 && loadingState && (
          <Button
            title="Reload Calibration"
            onPress={this.retryButtonPressed}
          />
        )}
      </SelectProductView>
    );
  }
}

const mapStateToProps = state => {
  const device = getCurrentDeviceSelector(state) || {};
  const products = device.products || {};

  return {
    loadingState: state.container.SelectProduct || {},
    device,
    products: Object.values(products),
  };
};
const mapDispatchToProps = dispatch => {
  const container = 'SelectProduct';
  return bindActionCreators(
    {
      getAvailableProducts: () => getAvailableProducts(container),
      setLoadingState: args => setLoadingState(container, args),
      setActivePosProduct: num => setActivePosProduct(container, num),
      setActiveProduct: num => setActiveProduct(container, num),
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectProductContainer);
