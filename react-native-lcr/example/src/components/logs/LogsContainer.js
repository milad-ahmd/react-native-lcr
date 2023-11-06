import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LogsView from './LogsView';

class LogsContainer extends Component {
  render() {
    const {logs} = this.props;
    return <LogsView logs={logs} />;
  }
}

const mapStateToProps = state => {
  const {logs} = state.stream;
  return {
    logs,
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LogsContainer);
