import React, {Component} from 'react';
import ConnectView from './ConnectView';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as streamActions} from '../../redux/modules/stream';
import {StreamStatus} from 'react-native-lcr';
import VersionNumber from 'react-native-version-number';
const {connectToStream, setStreamStatus} = streamActions;

class ConnectContainer extends Component {
  render() {
    const {connecting, navigation} = this.props;
    const {appVersion, buildVersion} = VersionNumber;
    const version = `${appVersion}:${buildVersion}`;
    console.log(connecting);
    return (
      <>
        <ConnectView
          connecting={connecting === StreamStatus.Connecting}
          onConnectPress={() => this.props.connectToStream()}
          versionNumber={version}
          navigation={navigation}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  const {status} = state.stream;
  return {
    connecting: status,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      connectToStream,
      setStreamStatus,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectContainer);
