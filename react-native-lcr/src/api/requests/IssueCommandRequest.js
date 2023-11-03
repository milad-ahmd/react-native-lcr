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
*   Issue Command
*   Offset  Size  Type  Name        Description
*   00      01    UB    msgID       Message ID to issue command. Set to 24h.
*   01      01    UB    command     Command byte.
*
*   Offset  Size  Type  Name        Description
*   00      01    UB    rc          Return code.
*   01      01    UB    devStatus   Device status byte.
*
*
*   Builds a request for the LCR to execute a command.
*
*   @param {Integer} address - The device address to send the request to
*   @param {CommandCode} command - The command to issue
*   @return {Object}
*
*/
export default function issueCommandRequest(address, command) {
  const body = [RequestId.IssueCommand, command]
  const requestName = "issue command: " + command
  const response = new StreamResponse({
    code: new DecimalType(1),
    devStatus: new DecimalType(1),
  })
  return { body, address, requestName, response }
}
