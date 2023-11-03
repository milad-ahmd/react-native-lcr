/**
*   From LCP documentation:
*
*   Command Codes
*   Command   Description
*         0   Start/Resume a delivery.
*         1   Pause the current delivery.
*         2   End the current delivery and print the ticket if the settings allow.
*         3   Place the LCR in auxiliary state.
*         4   Place the LCR in shift state and print the ticket if settings allow.
*         5   Place the LCR in calibration state. This only applies if the LCR was previously in factory mode.
*         6   Print a ticket based on the current state of the LCR. This command does not end
*               any deliveries, nor will it print a ticket if a delivery is active.
*/

const CommandCode = {
  StartResume: 0,
  Pause: 1,
  Print: 2,
  ShiftPrint: 2,
}

export default CommandCode
