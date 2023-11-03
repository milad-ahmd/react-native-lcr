import { StreamResponse, DecimalType } from "../StreamResponse"
import RequestId from "~/api/RequestId"

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
export default function getFieldDataRequest(address, field) {
  const body = [RequestId.GetFieldData, field.address]
  const requestName = "get " + field.description() + " field"
  const response = new StreamResponse({
    code: new DecimalType(1),
    deviceStatusByte: new DecimalType(1),
    value: field.dataType,
  })

  return { body, address, requestName, response }
}
