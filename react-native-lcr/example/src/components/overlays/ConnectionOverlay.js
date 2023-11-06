import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import styles from '../../styles/connectionOverlayStyles';
import {actions as navActions} from '../../redux/modules/nav';
import {navSelectors} from '../../redux/modules/selectors';
const {selectRoute} = navSelectors;
const {navigateToLogs} = navActions;

class ConnectionOverlay extends Component {
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentWillReceiveProps(_) {
    this.timeout = setTimeout(() => {
      if (this.list) {
        this.list.scrollToEnd();
      }
    }, 1000);
  }

  render() {
    const {hide, logs, navigateToLogs} = this.props;
    if (hide) {
      return null;
    }
    const recentLog = logs.slice(-3).pop();
    return (
      <View style={styles.root}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateToLogs()}>
          <Text style={styles.logText}>{recentLog}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderItem(data) {
    return (
      <View style={styles.row}>
        <Text style={{flex: 1}}>{data.item.log}</Text>
      </View>
    );
  }
}

ConnectionOverlay.propTypes = {
  logs: PropTypes.array.isRequired,
  navigateToLogs: PropTypes.func.isRequired,
  hide: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
  const {logs} = state.stream;
  const route = selectRoute(state.nav);
  const hide = route == 'Logs';
  return {
    logs,
    hide,
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      navigateToLogs,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionOverlay);
