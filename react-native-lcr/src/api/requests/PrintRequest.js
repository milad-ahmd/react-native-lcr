import {StreamResponse, DecimalType} from '../StreamResponse';
import RequestId from '../RequestId';
import {numberToBytes} from '../../helpers/numberHelpers';

/**
 *
 *   From LCP documentation:
 *
 *   Get Field Data
 *   Offset  Size  Type  Name        Description
 *   00      01    UB    msgID       Message ID to get field data. Set to 20h.
 *   01      01    UB    fieldNum    Field number to get.
 *
 *   Return from Get Field Data
 *   Offset  Size  Type  Name        Description
 *   00      01    UB    rc          Return code.
 *   01      01    UB    devStatus   Device status byte.
 *   02      n     ?     fieldData   Field data. Size and type dependant on field number.
 *
 *
 *   Builds a request for the LCR with the value of the field provided.
 *
 *   @param {Number} address - The device address to send the request to
 *   @param {Field} field - The field to fetch
 *   @return {Object}
 *
 */

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
 *   Print on LCR
 *   Offset Size Type Name Description
 *   00      01    UB      msgID     Message ID to print text. Set to 22h.
 *   01      n     UB      prnText   Text to print.
 *
 *   Offset Size Type Name Description
 *   00      01    UB      rc        Return code.
 *   01      01    UB      devStatus Device status byte.
 *
 *
 *   Builds a request for the LCR to execute a command.
 *
 *   @param {Integer} address - The device address to send the request to
 *   @param {CommandCode} command - The command to issue
 *   @return {Object}
 *
 */
export default function printRequest(address, field) {
  const body = [RequestId.PrintRequest].concat(field.getData());
  // const body = [RequestId.SetFieldData, field.address].concat(field.getData())

  const requestName = 'print text: ';
  const response = new StreamResponse({
    code: new DecimalType(1),
    devStatus: new DecimalType(1),
  });
  return {body, address, requestName, response};
}
