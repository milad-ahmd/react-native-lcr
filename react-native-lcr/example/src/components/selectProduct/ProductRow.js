import React, {PureComponent} from 'react';
import {Image, View, Text, TouchableHighlight} from 'react-native';
import styles from '../../styles/sharedStyles';
const checkmarkImage = require('../../assets/checkmark.png');

export default class ProductRow extends PureComponent {
  render() {
    const {onPress, isSelected, product} = this.props;
    return (
      <TouchableHighlight onPress={() => onPress(product)}>
        <View style={styles.row}>
          <Text style={styles.text}>
            {product.number + 1 + ': ' + product.name}
          </Text>
          <View style={{alignItems: 'flex-end', flex: 1, marginRight: 12}}>
            {isSelected && (
              <Image source={checkmarkImage} style={styles.checkmark} />
            )}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
