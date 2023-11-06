import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList} from 'react-native';
import styles from '../../styles/logsViewStyles';

export default class LogsView extends Component {
  render() {
    const {logs} = this.props;
    const data = logs.map((log, index) => ({key: index, log}));
    return (
      <View style={styles.root}>
        <FlatList
          ref={ref => {
            this.list = ref;
          }}
          data={data}
          renderItem={this.renderItem}
          style={styles.listView}
        />
      </View>
    );
  }

  renderItem(data) {
    return (
      <View style={styles.row}>
        <Text style={styles.rowText}>{data.item.log}</Text>
      </View>
    );
  }
}

LogsView.propTypes = {
  logs: PropTypes.array.isRequired,
};
