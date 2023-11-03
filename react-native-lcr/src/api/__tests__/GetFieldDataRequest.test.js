import Field from "~/models/Field"
import getFieldDataRequest from "../requests/GetFieldDataRequest"
import { DecimalType } from "../StreamResponse"

describe("getFieldDataRequest", () => {
  it("requests the field data", () => {
    let field = new Field(3, new DecimalType())
    let deviceAddress = 1

    const result = getFieldDataRequest(deviceAddress, field)
    expect(result).toMatchSnapshot()
  })
})
