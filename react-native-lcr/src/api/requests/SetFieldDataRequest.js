import {StreamResponse, DecimalType} from '../StreamResponse';
import RequestId from '../RequestId';

/**
 *
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
 *   Set Field Data
 *   Offset  Size  Type  Name        Description
 *   00      01    UB    msgID       Message ID to set field data. Set to 21h.
 *   01      01    UB    fieldNum    Field number to set.
 *   02      n     ?     fieldData   Field data. Size and type dependant on field number.
 *
 *   Return from Set Field Data
 *   Offset  Size  Type  Name        Description
 *   00      01    UB    rc          Return code.
 *   01      01    UB    devStatus   Device status byte.
 *
 *
 *   Builds a request for the LCR to update the value of the field provided.
 *
 *   @param {Integer} address - The device address to send the request to
 *   @param {Field} field - The field to set
 *   @return {Object}
 */
export default function setFieldDataRequest(address, field) {
  const body = [RequestId.SetFieldData, field.address].concat(field.getData());
  const requestName = 'set field: ' + field.description();
  const response = new StreamResponse({
    code: new DecimalType(1),
  });
  return {body, address, requestName, response};
}
