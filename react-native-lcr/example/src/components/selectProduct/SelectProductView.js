import React, {Component} from 'react';
import {
  FlatList,
  Text,
  TouchableHighlight,
  View,
  TextInput,
} from 'react-native';
import styles from '../../styles/sharedStyles';
import ProductRow from '../../components/selectProduct/ProductRow';

export default class SelectProductView extends Component {
  state = {};

  render() {
    const {posEnabled} = this.props;
    return (
      <View style={{...styles.root, flex: 1}}>
        {this.props.children}
        {posEnabled ? this.renderTextInput() : this.renderProductSelection()}
      </View>
    );
  }

  renderTextInput() {
    const {onPressContinue} = this.props;
    return (
      <View style={styles.root}>
        <View style={styles.rowLabels}>
          <Text style={styles.rowLabel}>ENTER PRODUCT NUMBER</Text>
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            autoFocus={true}
            maxLength={2}
            onChangeText={inputText => this.setState({inputText})}
          />
        </View>
        <TouchableHighlight
          style={styles.continueButton}
          onPress={() => onPressContinue(this.state.inputText)}>
          <Text style={[styles.text, styles.continueButtonText]}>CONTINUE</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderProductSelection() {
    const {products, selectedProduct, onSelectProductRow} = this.props;
    const selectedProductNumber = selectedProduct && selectedProduct.number;
    const productsData = products.map(product => ({
      product,
      key: product.number,
    }));
    return (
      <FlatList
        data={productsData}
        renderItem={({item: {product}}) => {
          return (
            <ProductRow
              key={product.number}
              product={product}
              onPress={onSelectProductRow}
              isSelected={selectedProductNumber == product.number}
            />
          );
        }}
        style={styles.listView}
      />
    );
  }
}
