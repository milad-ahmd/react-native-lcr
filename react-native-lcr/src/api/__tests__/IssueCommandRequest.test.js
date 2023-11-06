import issueCommandRequest from "../../../app/api/requests/IssueCommandRequest"
import CommandCode from "../../../app/models/CommandCode"

describe("setFieldDataRequest", () => {
  it("requests the field data", () => {
    let command = CommandCode.EndAndPrintDelivery
    let toNode = 1

    const result = issueCommandRequest(toNode, command)
    expect(result).toMatchSnapshot()
  })
})
