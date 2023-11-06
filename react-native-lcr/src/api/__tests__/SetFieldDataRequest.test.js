import Field from "~/models/Field"
import { DecimalType } from "../StreamResponse"
import setFieldDataRequest from "~/api/requests/SetFieldDataRequest"

describe("setFieldDataRequest", () => {
  it("sets the field data", () => {
    let field = new Field(3, new DecimalType())
    field.value = 10
    let deviceAddress = 1

    const result = setFieldDataRequest(deviceAddress, field)
    expect(result).toMatchSnapshot()
  })
})
