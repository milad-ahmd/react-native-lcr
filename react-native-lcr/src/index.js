import { NativeModules, Platform } from 'react-native';
import PrintRequest from './api/requests/PrintRequest';

const LINKING_ERROR =
  `The package 'react-native-lcr' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const Lcr = NativeModules.Lcr
  ? NativeModules.Lcr
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

// export function multiply(a , b) {
//   return Lcr.multiply(a, b);
// }
export {default as Field} from './models/Field';
export {AsciiType} from './api/StreamResponse';
export {default as issueCommandRequest} from './api/requests/IssueCommandRequest';
export {default as getFieldDataRequest} from './api/requests/GetFieldDataRequest';
export {default as getDeliveryStatusRequest} from './api/requests/GetDeliveryStatusRequest';
export {default as setFieldDataRequest} from './api/requests/SetFieldDataRequest';
export {default as StreamStatus} from './api/StreamStatus';
export {default as DeliveryCode} from './models/DeliveryCode';
export {default as Device} from './models/Device';
export {default as Product} from './models/Product';
export {default as streamQueue} from './api/StreamQueue';
export {default as CommandCode} from './models/CommandCode';

export default PrintRequest;
