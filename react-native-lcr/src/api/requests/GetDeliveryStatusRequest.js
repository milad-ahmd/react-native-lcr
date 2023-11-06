import {StreamResponse, BitfieldType, DecimalType} from '../StreamResponse';
import RequestId from '../RequestId';

/**
 *   From LCP documentation:
 *
 *   Data Type Definitions
 *   A   ASCII             AZ    ASCIIZ
 *   D   Double            F     Floating Point
 *   SB  Signed Byte       SI    Signed Integer
 *   SL  Signed Long       SS    Signed Short
 *   ST  Structure         UB    Unsigned Byte
 *   UI  Unsigned Integer  UL    Unsigned Long
 *   UN  Union Data        US    Unsigned Short
 *   V   LCR Volume
 *
 *   Get Delivery Status
 *   Offset  Size  Type  Name        Description
 *   00      01    UB    msgID       Message ID to get machine status. Set to 28h.
 *
 *   Return from Get Delivery Status
 *   Offset  Size  Type  Name        Description
 *   00      01    UB    rc          Return code.
 *   01      01    UB    devStatus   Device status byte.
 *   02      02    US    delStatus   Delivery status word.
 *   04      02    US    delCode     Delivery code word.
 *
 *
 *  Builds a request for the LCR to get the delivery status
 *
 *  @param {Number} address - The device address to send the request to
 *  @returns {Object}
 */

export default function getDeliveryStatusRequest(
  address,
  ignoreTimeout = false,
) {
  const body = [RequestId.GetDeliveryStatus];
  const requestName = 'delivery status';
  const response = new StreamResponse({
    rc: new DecimalType(1),
    devStatus: new DecimalType(1),
    delStatus: new DecimalType(2),
    delCode: new BitfieldType(2),
  });
  return {body, address, ignoreTimeout, requestName, response};
}
