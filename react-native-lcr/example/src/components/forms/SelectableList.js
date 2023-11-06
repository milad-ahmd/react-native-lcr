import React, {Component} from 'react';
import {TouchableHighlight, FlatList, View, Text, Image} from 'react-native';
import styles from '../../styles/sharedStyles';

const checkmarkImage = require('../../assets/checkmark.png');

export default class SelectableList extends Component {
  render() {
    const {data, onSelect, selectedIndex} = this.props;
    const mapped = data.map((data, index) => ({key: index, data}));

    return (
      <View>
        <FlatList
          data={mapped}
          renderItem={({index, item: {data}}) => (
            <TouchableHighlight onPress={() => onSelect(index)}>
              <View style={styles.row}>
                <Text stlye={styles.text}>{data.label}</Text>
                <View
                  style={{alignItems: 'flex-end', flex: 1, marginRight: 12}}>
                  {selectedIndex == index ? (
                    <Image source={checkmarkImage} style={styles.checkmark} />
                  ) : null}
                </View>
              </View>
            </TouchableHighlight>
          )}
          style={styles.listView}
        />
      </View>
    );
  }
}
