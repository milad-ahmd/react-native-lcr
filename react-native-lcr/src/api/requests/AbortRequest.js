import { StreamResponse, DecimalType } from "../StreamResponse"
import RequestId from "../RequestId"

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
*   Abort Request
*   Offset  Size  Type  Name     Description
*   00      01    UB    msgID    Message ID to abort previous request. Set to 7Eh.
*
*   Return from Abort Request
*   Offset  Size  Type  Name     Description
*   00      01    UB    rc       Return code.
*
*  Builds a request for the LCR to abort the last request received
*
*  @param {Integer} address - The node address to send the request to
*  @return {Object}
*
*/
export default function abortRequest(address) {
  const body = [RequestId.AbortRequest]
  const requestName = "abort command"
  const response = new StreamResponse({
    rc: new DecimalType(1),
  })

  return { body, address, requestName, response }
}
