import { StreamResponse, DecimalType, BitfieldType, AsciiType } from "../StreamResponse"

describe("StreamResponse", () => {
  describe("constructor", () => {
    describe("the message contains a multi-byte decimal value", () => {
      it("parses the message with the data types provided", () => {
        let binaryString = [
          126,
          126,
          255,
          1,
          130,
          6, //meta
          0, //code
          34, //status
          0,
          0,
          38,
          26, //9754
          174,
          78, //crc
        ]
        const response = new StreamResponse({
          code: new DecimalType(1),
          status: new BitfieldType(1),
          value: new DecimalType(),
        })
        const result = response.read(binaryString)
        expect(result["code"]).toEqual(0)
        expect(result["status"]).toEqual([false, true, false, false, false, true, false, false])
        expect(result["value"]).toEqual(9754)
      })
    })

    describe("the message contains a multi-byte string value", () => {
      it("parses the message with the data types provided", () => {
        let binaryString = [
          126,
          126,
          255,
          1,
          130,
          13, //meta
          0, // code
          2, //product id
          83,
          68,
          54,
          48,
          48,
          118,
          50,
          46,
          51,
          48,
          0, //name
          100,
          36, //crc
        ]
        const response = new StreamResponse({
          code: new DecimalType(1),
          productId: new DecimalType(1),
          name: new AsciiType(),
        })
        const result = response.read(binaryString)
        expect(result["code"]).toEqual(0)
        expect(result["productId"]).toEqual(2)
        expect(result["name"].slice(0, -1)).toEqual("SD600v2.30")
      })
    })
  })
})
