import { numberToBytes, floatToBytes, formatAmountWithDecimalPlaces } from "../numberHelpers"

describe("numberHelpers", () => {
  describe("#floatToBytes", () => {
    it("returns an array of decimal values", () => {
      expect(floatToBytes(36.1)).toEqual([66, 16, 102, 102])
    })
  })

  describe("#numberToBytes", () => {
    it("returns an array of decimal values representing the number in bytes", () => {
      let amount = 500
      expect(numberToBytes(amount, 4)).toEqual([0, 0, 1, 244])
    })
  })

  describe("#formatAmountWithDecimalPlaces", () => {
    let decimalPlaces = 1

    it("returns the amount formatted to contain the number of decimal places in the props", () => {
      let amount = "200"
      expect(formatAmountWithDecimalPlaces(amount, decimalPlaces)).toEqual("200.0")

      amount = "200.1"
      expect(formatAmountWithDecimalPlaces(amount, decimalPlaces)).toEqual("200.1")
    })

    describe("there are extra decimal points", () => {
      it("clips any values after the second decimal point", () => {
        let amount = "200.1.9."
        expect(formatAmountWithDecimalPlaces(amount, decimalPlaces)).toEqual("200.1")
      })
    })

    describe("there are extra characters after the decimal", () => {
      it("clips the extra characters by rounding", () => {
        let amount = "200.190394"
        expect(formatAmountWithDecimalPlaces(amount, decimalPlaces)).toEqual("200.2")
      })
    })
  })
})
