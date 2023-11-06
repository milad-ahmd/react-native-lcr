import {Dimensions} from 'react-native';

let windowDimensions = Dimensions.get('window');
let smallButtonDiameter = windowDimensions.width * 0.26;
let largeButtonDiameter = windowDimensions.width * 0.4;

const styles = {
  root: {
    backgroundColor: '#fefefe',
    paddingBottom: 80,
    flex: 1,
  },
  devicesList: {},
  text: {
    fontFamily: 'System',
    fontSize: 17,
  },
  textInput: {
    flex: 1,
    height: 50,
    textAlign: 'center',
  },
  productNumber: {
    marginTop: 20,
    fontFamily: 'System',
    fontSize: 17,
    alignSelf: 'center',
  },
  receiptText: {
    marginTop: 14,
    alignSelf: 'center',
    color: '#D0011B',
    fontFamily: 'System',
    fontSize: 13,
  },
  deliveryText: {
    fontFamily: 'System',
    fontSize: 17,
    flex: 1,
  },
  deliveryTextUpdating: {
    color: '#D0011B',
    fontFamily: 'System',
    fontSize: 17,
    flex: 1,
  },
  listView: {
    borderBottomColor: '#C8C7CC',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  row: {
    borderTopColor: '#C8C7CC',
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  rowLabels: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 7,
  },
  rowLabel: {
    flex: 1,
    color: '#6D6D72',
    fontSize: 13,
  },
  button: {
    backgroundColor: 'gray',
    height: 40,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    marginTop: 10,
    color: 'white',
  },
  deviceText: {
    color: '#62717A',
    marginLeft: 12,
  },
  deviceImage: {
    height: 18,
    marginLeft: 6,
    width: 15,
  },
  checkmark: {
    height: 16,
    width: 18,
  },
  selections: {
    marginTop: 24,
  },
  selection: {
    borderBottomColor: '#C8C7CC',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 16,
  },
  selectionLeft: {
    flex: 2,
  },
  selectionRight: {
    flex: 1,
    textAlign: 'right',
  },
  active: {
    color: 'black',
    fontFamily: 'System',
    fontSize: 17,
  },
  inactive: {
    color: '#ddd',
    fontFamily: 'System',
    fontSize: 17,
  },
  deliveryButtons: {
    justifyContent: 'center',

    flexDirection: 'row',
  },
  printButton: {
    alignItems: 'center',
    borderColor: '#D6D8D9',
    borderWidth: 3,
    borderRadius: smallButtonDiameter / 2,
    height: smallButtonDiameter,
    justifyContent: 'center',
    width: smallButtonDiameter,
  },
  printButtonText: {
    color: '#D8D8D8',
    fontSize: 22,
  },
  switchContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flex: 1,
    marginTop: 5,
    marginRight: 12,
    alignItems: 'center',
  },
  warningText: {
    alignSelf: 'center',
    marginRight: 12,
    marginLeft: 12,
    color: '#D0011B',
    fontFamily: 'System',
    fontSize: 13,
  },
  runButton: {
    alignItems: 'center',
    backgroundColor: '#D0011B',
    borderColor: '#D0011B',
    borderWidth: 3,
    borderRadius: largeButtonDiameter / 2,
    height: largeButtonDiameter,
    justifyContent: 'center',
    marginLeft: 6,
    marginRight: 6,
    width: largeButtonDiameter,
  },
  runButtonText: {
    color: '#ffffff',
    fontSize: 22,
  },
  runButtonInactive: {
    alignItems: 'center',
    borderColor: '#D0011B',
    borderWidth: 3,
    borderRadius: largeButtonDiameter / 2,
    height: largeButtonDiameter,
    justifyContent: 'center',
    marginLeft: 6,
    marginRight: 6,
    width: largeButtonDiameter,
  },
  runButtonTextInactive: {
    color: '#962525',
    fontSize: 22,
  },
  continueButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fed100',
    height: 44,
  },
  continueButtonText: {
    color: '#ffffff',
  },
};

export default styles;
