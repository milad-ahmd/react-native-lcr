import DeliveryCode from "~/models/DeliveryCode"

/*
  TicketPending: 0,
  ShiftTicketPending: 1,
  Flowing: 2,
  Active: 3,
  DeliveringGrossPreset: 4,
  DeliveringNetPreset: 5,
*/

describe("DeliveryCode", () => {
  var bitfield = null
  beforeEach(() => {
    bitfield = new Array(16).fill(false)
  })

  describe("#flowing", () => {
    it("shows the correct value", () => {
      let bitIndex = 2
      var code = new DeliveryCode(bitfield)
      expect(code.flowing).toBeFalsy()
      bitfield[bitIndex] = true
      code = new DeliveryCode(bitfield)
      expect(code.flowing).toBeTruthy()
    })
  })

  describe("#active", () => {
    it("shows the correct value", () => {
      let bitIndex = 3
      var code = new DeliveryCode(bitfield)
      expect(code.active).toBeFalsy()
      bitfield[bitIndex] = true
      code = new DeliveryCode(bitfield)
      expect(code.active).toBeTruthy()
    })
  })

  describe("#ticketPending", () => {
    it("shows the correct value", () => {
      let bitIndex = 0
      var code = new DeliveryCode(bitfield)
      expect(code.ticketPending).toBeFalsy()
      bitfield[bitIndex] = true
      code = new DeliveryCode(bitfield)
      expect(code.ticketPending).toBeTruthy()
    })
  })

  describe("#shiftTicketPending", () => {
    it("shows the correct value", () => {
      let bitIndex = 1
      var code = new DeliveryCode(bitfield)
      expect(code.shiftTicketPending).toBeFalsy()
      bitfield[bitIndex] = true
      code = new DeliveryCode(bitfield)
      expect(code.shiftTicketPending).toBeTruthy()
    })
  })

  describe("#deliveringGrossPreset", () => {
    it("shows the correct value", () => {
      let bitIndex = 4
      var code = new DeliveryCode(bitfield)
      expect(code.deliveringGrossPreset).toBeFalsy()
      bitfield[bitIndex] = true
      code = new DeliveryCode(bitfield)
      expect(code.deliveringGrossPreset).toBeTruthy()
    })
  })

  describe("#deliveringNetPreset", () => {
    it("shows the correct value", () => {
      let bitIndex = 5
      var code = new DeliveryCode(bitfield)
      expect(code.deliveringNetPreset).toBeFalsy()
      bitfield[bitIndex] = true
      code = new DeliveryCode(bitfield)
      expect(code.deliveringNetPreset).toBeTruthy()
    })
  })
})
