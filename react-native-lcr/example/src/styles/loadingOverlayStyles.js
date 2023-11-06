import {Dimensions} from 'react-native';

let windowDimensions = Dimensions.get('window');

const styles = {
  root: {
    zIndex: 10,
  },

  disablingView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: windowDimensions.height,
    backgroundColor: 'white',
    opacity: 0.6,
  },

  barBackground: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },

  label: {
    margin: 15,
    color: '#333',
    fontFamily: 'System',
    fontSize: 14,
    flex: 1,
  },

  activity: {
    margin: 15,
  },

  button: {
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#D0011B',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  buttonTitle: {
    color: '#D0011B',
    fontSize: 12,
  },
};

export default styles;
