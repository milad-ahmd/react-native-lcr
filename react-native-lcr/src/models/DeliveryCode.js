/**
*   From LCP documentation:
*
*   Delivery Code Bits
*
*   Bit position  Description
*              1  Indicates that a delivery ticket is pending. A new delivery cannot be started until this
*                   bit is cleared via successfully printing the last delivery ticket.
*              2  Indicates that a shift ticket has been requested and is waiting to be printed.
*              3  Indicates flow is active during a delivery. The bit is turned on and off with the Delivery
*                   Code Bit #3 bit but is also turned off when a delivery is paused and turned back on when it is resumed.
*              4  Indicates that a delivery is active. The bit is turned on just before Delivery Code Bit
*                   #10 is turned off and is turned off at the end of the delivery.
*              5  Indicates the current delivery is delivering a gross preset quantity. When this quantity
*                   is reached the delivery will either end or pause depending on the value of Field #27.
*              6  Indicates the current delivery is delivering a net preset quantity. When this quantity is
*                   reached the delivery will either end or pause depending on the value of Field #27.
*              7  Indicates the current delivery has been stopped due to the gross preset value being
*                   reached. Depending on the value of Field #27 the delivery will either terminate or pause.
*              8  Indicates the current delivery has been stopped due to the net preset value being
*                   reached. Depending on the value of Field #27 the delivery will either terminate or pause.
*              9  Indicates that the current product will be temperature volume compensated during delivery.
*             10  This bit is cleared at the beginning of a delivery and is set when solenoid 1 is closed
*                   due to the remaining gross or net preset value being less than or equal to the value in Field #26.
*             11  Indicates that a delivery is in the process of being started. Once the delivery has been
*                   started successfully, this bit is turned off.
*             12  Indicates that a new delivery has been queued in the LCR. This condition occurs
*                   when a Command #0 is issued and the switch is in the STOP, PRINT, or SHIFT PRINT position.
*             13  Indicates that a data access error occurred during a delivery which was not critical to
*                   the delivery but that a default was used in place of the data that was attempting to be read.
*             14  Indicates that a configuration event has occurred.
*             15  Indicates that a calibration event has occurred.
*             16  Reserved.
*/

const DeliveryBits = {
  TicketPending: 0,
  ShiftTicketPending: 1,
  Flowing: 2,
  Active: 3,
  DeliveringGrossPreset: 4,
  DeliveringNetPreset: 5,
}

export default class DeliveryCode {
  constructor(bitfield, prevDeliveryCode = {}) {
    this.active = bitfield[DeliveryBits.Active] || false
    this.flowing = bitfield[DeliveryBits.Flowing] || false
    this.ticketPending = bitfield[DeliveryBits.TicketPending] || false
    this.shiftTicketPending = bitfield[DeliveryBits.ShiftTicketPending] || false
    this.deliveringGrossPreset = bitfield[DeliveryBits.DeliveringGrossPreset] || false
    this.deliveringNetPreset = bitfield[DeliveryBits.DeliveringNetPreset] || false
    this.finished = !this.active && (prevDeliveryCode.finished || prevDeliveryCode.active)
  }

  deliveringPreset() {
    return this.deliveringGrossPreset || this.deliveringNetPreset
  }

  needsPrint() {
    return this.active && !this.flowing && (this.ticketPending || this.shiftTicketPending)
  }

  description() {
    if (!this.active) {
      return "No Active Delivery"
    }
    if (this.flowing) {
      return "Flowing"
    }
    return "Delivery in progress"
  }
}
