/**
 *  The request message id used to call functions on the LCR
 */

const RequestId = {
  GetProductId: 0,
  GetFieldData: 32,
  SetFieldData: 33,
  GetDeliveryStatus: 40,
  IssueCommand: 36,
  AbortRequest: 126,
  CheckRequest: 125,
  PrintRequest: 34,
};

export default RequestId;
