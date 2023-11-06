import {floatToBytes, numberToBytes} from '../helpers/numberHelpers';
import {DecimalType, AsciiType} from '../api/StreamResponse';
import {stringToBytes} from '../helpers/stringHelpers';

/**
 *    From LCP documentation:
 *
 *    Field Numbers
 *
 *    Field   Type        Description
 *    0       LIST+0      Product number that is active.
 *    1       TEXT        Product code that can be displayed on the delivery ticket. Each product number can be assigned a unique product code. The product code set during configuration will be the default for that product after power up.
 *    2       VOLUME      Gross quantity of current delivery. This value can go negative, unlike Field #44.
 *    3       VOLUME      Net quantity of current delivery. This field will only contain a non-zero value if the product is being temperature compensated. This value can go negative, unlike Field #45.
 *    4       VOLUME      Flow rate of the current delivery. The label on this value is Field #38 per Field #41.
 *    5       VOLUME      Gross preset value set for the current delivery. Each product number can be assigned a unique gross preset value.
 *    6       VOLUME      Net preset value set for the current delivery. Each product number can be assigned a unique net preset value.
 *    7       SFLOAT+1    Current temperature of product being delivered. The label on this value is Field #35 and is calculated as follows: (Field #77 * Field #78) + Field #79 + Field #34.
 *    8       LIST+20     Indicates how residuals are handled in the quantity fields. Residuals can be rounded or truncated.
 *    9       UFLOAT+6    Contains the number of pulses that have to occur for each distance unit displayed on the odometer. Currently not in use.
 *    10      UFLOAT+1    Calibrated odometer reading. This field can be set to the actual distance traveled so as to calculate the correct value for Field #9. Currently not in use.
 *    11      TEXT        Product descriptor that can be displayed on the delivery ticket. Each product number can be assigned a unique product descriptor. The product descriptor set during configuration will be the default for that product after power up.
 *    12      UFLOAT+1    Odometer reading. Currently not in use.
 *    13      VOLUME      Gross quantity of current shift. Each product number maintains its own gross shift quantity. This value is reset to zero when a shift ticket is printed or when Field #16 is set to 0.
 *    14      VOLUME      Net quantity of current shift. Each product number maintains its own net shift quantity. This value is reset to zero when a shift ticket is printed or when Field #16 is set to 0.
 *    15      LONG        Number of deliveries made during the current shift. Each product number maintains its own number of deliveries. This value is reset to zero when a shift ticket is printed or when Field #16 is set to 0.
 *    16      LIST+5      Setting this field to 0 causes the shift data to be cleared. If Field #37 is set to 0, the shift ticket must be successfully printed before the shift data is cleared. If Field #37 is set to 1, the shift ticket will be printed if the printer is on-line and ready to print, but in any event, the shift data is then cleared.
 *    17      VOLUME      Cumulative gross quantity delivered of the current product.
 *    18      VOLUME      Cumulative net quantity delivered of the current product.
 *    19      LIST+3      Format to use when displaying the date.
 *    20      DATE        Current date.
 *    21      TIME        Current time.
 *    22      LONG        Sale number assigned to the current delivery. The sale number is incremented at the start of a delivery.
 *    23      LONG        Ticket number to be printed on the next delivery ticket. Setting this field to zero causes the ticket number to not be printed on the delivery ticket. The ticket number is incremented after it is printed on a delivery ticket or duplicate delivery ticket.
 *    24      TEXT        LCR unit identifier that can be displayed on the delivery ticket.
 *    25      INTEGER     Time, in seconds, that is allowed when pausing a delivery before the delivery is automatically ended and a delivery ticket printed. Setting this field to zero disables this feature and causes a message, indicating that there were multiple deliveries at one site, to be printed on the delivery ticket.
 *    26      VOLUME      Used when delivering a preset amount to indicate when to close solenoid 1, thus causing the LCR to deliver at a reduced dwell flow rate. When delivering a preset amount and Field #92 or Field #93 is less than or equal to this field, solenoid 1 will close.
 *    27      LIST+7      Type of preset being delivered when Field #5 or Field #6 is not zero. Clear presets are those that will end the delivery when the preset amount is reached and then clear the preset amount. Multiple presets will pause the delivery when the preset amount is reached and allow the same preset amount to be delivered again. In this case, the preset amount will be cleared when the delivery is explicitly ended with Command #2, or when it ends when the no flow timer times out. Retain presets are similar to clear presets with the exception that the preset amount is not cleared at the end of the delivery. Required presets will require a preset amount to be entered prior to any and all deliveries.
 *    28      LIST+9      Indicates whether a rising or falling edge is generated on the scaled pulse output when the quantity is incremented.
 *    29      LIST+8      Indicates which header line is accessible via Field #30.
 *    30      TEXT        Header line text that will be printed on the delivery ticket. If the header line is blank, it will not be printed on the ticket. Header line 11 will only be printed if it is not blank and if Field #86 is set to 0. Header line 12 will only be printed if it is not blank and if Field #87 is set to 1.
 *    31      LIST+5      Indicates whether or not the gross volume and compensation parameter is to be printed on the delivery ticket.
 *    32      LIST+5      Indicates whether or not the volume corrected message is to be printed on the delivery ticket.
 *    33      SFLOAT+2    Current temperature of product being delivered. The label on this value is Field #35 and is calculated as follows: (Field #77 * Field #78) + Field #79 + Field #34.
 *    34      SFLOAT+2    Value that is added to Field #33 and Field #7 so as to fine tune the accuracy of the temperature reading. This field allows the temperature to be fine tuned without entering factory calibration.
 *    35      LIST+10     Unit of the temperature fields, Field #33 and Field #7.
 *    36      TEXT        LCR meter identifier that can be displayed on the delivery ticket.
 *    37      LIST+5      Used to indicate whether or not a delivery ticket is required. If this field is set to 0, a complete delivery ticket must be printed before the next delivery can be started. If the field is set to 1, a delivery ticket will be printed if there is a printer available online; if the field is set to 2, a delivery ticket will never be printed.
 *    38      LIST+4      The unit label applied to the quantity delivered.
 *    39      LIST+14     Number of places past the decimal that are to be displayed in fields of type VOLUME.
 *    40      LIST+21     Specifies the LCR’s interpretation of forward flow through the meter.
 *    41      LIST+11     Specifies the time unit that is applied when calculating the flow rate.
 *    42      LONG        Number of calibration events that have occurred in the LCR. Calibration events include the following: Pulses Per Unit (k-Factor), Linearization Flow Rate, Linearization Percent Error, and Activating Linearization.
 *    43      LONG        Number of configuration events that have occurred in the LCR, used by Weights & Measures only. Configuration events include the following: Sale Number, Gross Totalizer, Net Totalizer, Product Type, Compensation Type, Compensation Parameter, Base Temperature, Auxiliary Multiplier, Auxiliary Unit of Measure, S1 Close, Temperature Offset, Temperature Scale, Quantity Unit of Measure, Decimal Setting, Flow Rate Unit of Measure, Printer Type, Ticket Required Flag, Flow Direction, Meter ID, Ticket Number, Residual Processing, Print Gross and Parameter Flag, and Print Volume Corrected Message Flag.
 *    44      VOLUME      Gross quantity of current delivery. Unlike Field #2, this value will not go negative. Its value will match the number displayed on the electronic counter on the LCR when temperature compensation is not active.
 *    45      VOLUME      Net quantity of current delivery. Unlike Field #3, this value will not go negative. Its value will match the number displayed on the electronic counter on the LCR when temperature compensation is active and the LCR is not in calibration mode.
 *    46      SFLOAT+3    Gross quantity of current prover delivery. This field maintains a higher accuracy than Field #2 and can be set to the actual amount delivered so as to calculate the correct value for Field #47.
 *    47      UFLOAT+6    Contains the number of pulses that have to occur for each unit of product delivered.
 *    48      UFLOAT+3    Multiplier applied to the gross or net quantity delivered which results in an auxiliary quantity that can be printed on the delivery ticket or displayed to the user. The gross quantity is used if temperature compensation is not active, otherwise the net quantity is used.
 *    49      LIST+6      The unit label applied to the auxiliary quantity delivered.
 *    50      LONG        Number of times calibration mode has been entered in the LCR.
 *    51      LIST+12     Linearization point number that is accessible via the fields Field #52 and Field #53.
 *    52      UFLOAT+2    Flow rate of the current linearization point. A flow rate of 0.00 disables the use of the linearization point.
 *    53      SFLOAT+3    Percent error of the quantity delivered when the product flows at the rate defined in Field #52.
 *    54      SFLOAT+3    Gross quantity of current prover delivery. This field can be set to the actual amount delivered so as to calculate the percent error stored in Field #53.
 *    55      LIST+25     Used to specify that the linearization points should be applied to deliveries. When setting this field to 0 the linearization points are sorted by flow rate in descending order.
 *    56      LIST+19     Type of printer that is connected to the RS-232 printer port of the LCR.
 *    57      LIST+15     Compensation type that is being used for the current active product. Each product number can be assigned a unique compensation type.
 *    58      FFLOAT      Compensation parameter that is being used for the current active product. Each product number can be assigned a unique compensation parameter.
 *    59      SFLOAT+1    Base temperature used when calculating the net quantity based on the selected compensation type and parameter. Each product number uses a unique base temperature for that product. The base temperature can be set for linear compensation only.
 *    60      TEXT        Version of the software running in the LCR.
 *    61      SFLOAT+4    Price charged per unit of delivered product.
 *    62      SFLOAT+4    Tax charged per unit of delivered product.
 *    63      SFLOAT+4    Percent tax charged per monetary unit of delivered product.
 *    64      LIST+16     Used to get the next index for any active diagnostic messages. Calling the get function with zero in the field data causes the first diagnostic message index to be returned. If the get function is called without a zero in the field data, the first diagnostic message is returned if the delivery status or delivery code has changed since the last call. Calling the set function will always return the next diagnostic message index as a circular list. Note that the better way to get to these status bits is with the “Get Machine Status” message (MsgID 23h).
 *    65      SFLOAT+2    Total tax per unit charged for the delivered product. This is the rounded result of multiplying Field #2 or Field #3 by Field #62. Field #2 is used if temperature compensation is not active, otherwise Field #3 is used.
 *    66      SFLOAT+2    Total percentage tax charged for the delivered product. This is the rounded result of multiplying Field #95 by Field #63.
 *    67      INTEGER     Contains a bit map showing how the temperature and voltage calibrations were performed. The LCR A to D Code Masks are used to mask the flags in this field.
 *    68      UFLOAT+1    Supply voltage being applied to the LCR. The supply voltage is calculated as follows: (Raw Voltage * 0.00125) + 12.
 *    69      LONG        Number of pulser reversals that have occurred during the current delivery.
 *    70      TEXT        Date and time the current shift started.
 *    71      VOLUME      Auxiliary quantity of current delivery. This value is calculated by multiplying Field #2 or Field #3 by Field #48. Field #2 is used if temperature compensation is not active, otherwise Field #3 is used.
 *    72      TEXT        Used to unlock the LCR or change the users key. If the LCR is currently locked and this field receives the key that matches the one in Field #81, the LCR will be unlocked. If the LCR is already unlocked, any value set in this field becomes the new user key by being set in Field #81.
 *    73      LIST+13     Getting this field will return the current locked/unlocked status of the LCR. Setting this field to 0 will lock the LCR.
 *    74      TEXT        Setting this field to the correct factory key places the LCR at factory security level. Factory security level is terminated when an incorrect factory key is set, when the switch on the LCR leaves the calibration position, or when power is applied to the LCR.
 *    75      SFLOAT+1    Setting this field to any value causes it to be reset to the average of Field #77 read 100 times. This new value is then used to calculate Field #79 as follows: -Field #75 * Field #78. A 100.0 r 0.01% ohm resister must be attached to the temperature probe input before this field is set. Setting this field causes bit #2 and bit #3 to be cleared and bit #0 to be set in Field #67.
 *    76      SFLOAT+1    Setting this field to any value causes it to be reset to the average of Field #77 read 100 times. This new value is then used to calculate Field #78 as follows: 74.0 / (Field #76 - Field #75). Field #79 is then recalculated as follows: -Field #75 * Field #78. Field #75 must be set before this field is set. A 128.6 r 0.01% ohm resister should be attached to the temperature probe input before this field is set. Setting this field causes bit #1 to be set in Field #67.
 *    77      INTEGER     Raw ADC value coming from the A to D converter used to calculate the temperature of the product being delivered.
 *    78      UFLOAT+6    Slope used when calculating the temperature of the product from the raw ADC. This field can either be set explicitly or be calculated by setting Field #75 followed by setting Field #76. Setting this field explicitly causes bit #0 and bit #1 to be cleared and bit #2 to be set in Field #67.
 *    79      SFLOAT+3    Offset used when calculating the temperature of the product from the raw ADC. This field can either be set explicitly or be calculated by setting Field #75 followed by setting Field #76. Setting this field explicitly causes bit #0 and bit #1 to be cleared and bit #3 bit to be set in Field #67.
 *    80      TEXT        Identifier of the hardware board in the LCR.
 *    81      TEXT        Contains the users key that can be used to unlock the LCR.
 *    82      LIST+5      When set to 0, all fields in the LCR will be set to their initial default values.
 *    83      LIST+17     Compensation parameter that will be printed on the delivery ticket for the current active product. This is a parallel list to the one accessed via Field #57.
 *    84      LIST+18     Compensation temperature that will be printed on the delivery ticket for the current active product. This is a parallel list to the one accessed via Field #57.
 *    85      LIST+1      Secifies the types of presets that can be used.
 *    86      LIST+22     Defines how auxiliary port 1 should be used. Setting this to 0 causes header line 11 to be printed on the delivery ticket, assuming header line 11 is not blank.
 *    87      LIST+23     Defines how auxiliary port 2 should be used. Setting this to 1 causes header line 12 to be printed on the delivery ticket, assuming header line 12 is not blank.
 *    88      LIST+0      Default product number used when the LCR is powered up.
 *    89      TEXT        Date and time the last delivery started.
 *    90      TEXT        Date and time the last delivery finished.
 *    91      TEXT        Date and time of last calibration.
 *    92      VOLUME      Gross quantity remaining on the current gross preset delivery.
 *    93      VOLUME      Net quantity remaining on the current net preset delivery.
 *    94      LIST+2      Type of product being delivered. Each product number can be assigned a unique product type.
 *    95      SFLOAT+2    Non-taxed cost of delivered product. This is the rounded result of multiplying Field #2 or Field #3 by Field #61. Field #2 is used if temperature compensation is not active, otherwise Field #3 is used.
 *    96      SFLOAT+2    Total tax charged for the delivered product. This is the sum of Field #65 and Field #66.
 *    97      SFLOAT+2    Taxed cost of delivered product. This is the sum of Field #95 and Field #96.
 *    98      TEXT        Version of the delivery ticket format being used in the LCR.
 *    99      TEXT        Version of the language text being displayed on the lappad in RS-232 mode.
 *    100     VOLUME      Gross meter totalizer at the beginning of the last delivery.
 *    101     VOLUME      Net meter totalizer at the beginning of the last delivery.
 *    102     INTEGER     Node address used by the LCR when it is run in the 485 bank of software.
 *    103     TEXT        Reserved—Should not be accessed by a host application.
 *    104     TEXT        Reserved—Should not be accessed by a host application.
 *    105     LONG        Password used to begin a new shift and/or delivery in SR216/SR266 control software.
 *    106     LONG        Customer number receiving the fuel in SR216/SR266 control software.
 *    107     LIST+26     Specifies when the password field will be required in SR216/SR266 control software.
 *    108     LIST+27     Specifies when a prompt will be issued for the customer number field in SR216 control software.
 *    109     SFLOAT+1    Maximum pressure differential read during the delivery in SR214/SR264 control software.
 *    110     VOLUME      Flow rate where the maximum pressure differential was read during the delivery in SR214/SR264 control software.
 *    111     SFLOAT+1    The maximum allowed pressure reading from the transducer before the last delivery was terminated.
 *    112     INTEGER     The node address of the Database Manager application running on the office PC (LCR600 only).
 *    113     INTEGER     The node address of the File Server running in the LCR (LCR600 only).
 *    114     LIST+50     Port address of the File Server (LCR600 only).
 *    115     LIST+51     Baud rate used by the File Server (LCR600 only).
 *    116     INTEGER     Number of retries used by the File Server (LCR600 only).
 *    117     LIST+52     TxEnable bit used by the File Server (LCR600 only).
 *    118     INTEGER     Timeout used by the File Server (LCR600 only).
 *    119     UFLOAT+2    Pulse Output Frequency for the current active product calibration (LCR600 only).
 *    120     VOLUME      Auxiliary 1 Flow Rate Toggle for the current active product calibration.
 *    121     VOLUME      Auxiliary 2 Flow Rate Toggle for the current active product calibration.
 *    122     LIST+53     Format of the delivery screen (LCR600 only).
 *    123     TEXT        Bootloader revision number (LCR600 only).
 *    124     TEXT        The key used to activate the advanced feature. (LCR600 only)
 *    125     LONG        The set of flags that indicate which features have been purchased. (LCR600 only)
 *    126     VOLUME      Average flow rate.
 *    127     VOLUME      Compensated flow rate.
 *    128     LIST+54     Specifies the time unit that is applied when calculating the flow rate.
 *    192     SFLOAT+2    The price preset value for the current active product calibration number.
 *    193     LIST+60     Specifies the current POS lock discounts setting.
 *    194     LIST+61     Specifies the current POS lock price setting.
 *    195     LIST+62     Specifies the current POS save new price setting.
 *    196     LIST+63     Specifies the current POS allow new delivery price setting.
 *    197     INTEGER     Current POS product number.
 *    198     TEXT        POS product name assigned to the current product number.
 *    199     TEXT        POS product code assigned to the current product number.
 *    200     LIST+2      Type of POS product being delivered. Each product number can be assigned a unique product type.
 *    201     LIST+64     Calibration number assigned to the current POS product number.
 *    202     SFLOAT+4    POS default price assigned to the current product number.
 *    203     LIST+65     POS tax category assigned to the current product number.
 *    204     LIST+66     POS cash discount assigned to the current product number.
 *    205     LIST+67     POS volume discount assigned to the current product number.
 *    206     LIST+68     Current POS tax number.
 *    207     TEXT        POS tax name assigned to the current tax number.
 *    208     LIST+69     POS tax category assigned to the current tax number.
 *    209     SFLOAT+4    POS tax value assigned to the current tax number.
 *    210     LONG        POS per unit tax value assigned to the current tax number.
 *    211     TEXT        POS header tax value for the percent tax assigned to the current tax number.
 *    212     LIST+71     Current POS cash discount number.
 *    213     TEXT        POS cash discount name assigned to the current cash discount number.
 *    214     LIST+72     POS cash discount interval assigned to the current cash discount number.
 *    215     SFLOAT+3    POS cash discount percent assigned to the current cash discount number.
 *    216     SFLOAT+4    POS per unit cash discount percent assigned to the current cash discount number.
 *    217     INTEGER     POS cash discount days interval assigned to the current cash discount number.
 *    218     LIST+73     POS cash discount apply field assigned to the current cash discount number.
 *    219     LIST+74     Current POS volume discount number.
 *    220     TEXT        POS volume discount name assigned to the current volume discount number.
 *    221     LIST+75     POS volume discount interval assigned to the current volume discount number.
 *    222     SFLOAT+3    POS volume discount percent assigned to the current volume discount number.
 *    223     SFLOAT+4    POS per unit volume discount percent assigned to the current volume discount product number.
 *    224     VOLUME      POS volume discount amount assigned to the current volume discount number.
 *    225     LIST+76     POS volume discount apply field assigned to the current volume discount number.
 *    226     SFLOAT+2    Calculated subtotal on the current delivery.
 *    227     SFLOAT+2    Calculated volume discount available on the current delivery when applied before taxes.
 *    228     SFLOAT+2    Calculated total tax due on the current delivery.
 *    229     SFLOAT+2    Calculated volume discount available on the current delivery applied after taxes.
 *    230     SFLOAT+2    Calculated total due on the current delivery.
 *    231     SFLOAT+2    Calculated cash discount available on the current delivery.
 *    232     TEXT        Calculated discount date for a specific interval.
 *    233     LIST+77     POS miscellaneous charge number assigned to the current miscellaneous charge number.
 *    234     TEXT        POS miscellaneous charge name assigned to the current miscellaneous charge number.
 *    235     LIST+78     POS miscellaneous charge tax assigned to the current miscellaneous charge number.
 *    236     SFLOAT+4    POS miscellaneous charge price assigned to the current miscellaneous charge number.
 *    237     INTEGER     POS miscellaneous charge quantity assigned to the current miscellaneous charge number.
 *    238     SFLOAT+2    Calculated POS miscellaneous charge subtotal on the current delivery.
 *    239     SFLOAT+2    Calculated POS miscellaneous charge tax due on the on the current delivery.
 *    240     SFLOAT+2    Calculated POS miscellaneous charge total due on the current delivery.
 *
 *    Note: The use of "product" is deprecated in favor of "calibration." The documentation copied above does not
 *    reflect this yet.
 */

const FieldNames = {
  0: 'activeProductNumber',
  11: 'activeProductDescriptor',
  198: 'activePOSProductName',
  197: 'activePOSProductNumber',
  201: 'activePOSProductCalibration',

  2: 'currentGrossQuantity',
  3: 'currentNetQuantity',
  4: 'currentFlowRate',
  230: 'calculatedTotalDue',

  5: 'grossPreset',
  6: 'netPreset',
  192: 'pricePreset',

  57: 'compensationType',
  39: 'volumeDecimalPlaces',
  47: 'pulsesPerUnit',
  125: 'purchasedFeatures',
};

export default class Field {
  constructor(address, dataType, defaultValue = null) {
    this.name = FieldNames[address];
    this.address = address;
    this.dataType = dataType;
    this.value = defaultValue;
  }

  description() {
    return `${this.name}: ${this.address}`;
  }

  getData() {
    if (this.dataType instanceof AsciiType) {
      return stringToBytes(this.value);
      // throw "Can't convert string to data"
    } else if (this.dataType instanceof DecimalType) {
      return numberToBytes(this.value, this.dataType.length || 1);
    }
    return floatToBytes(this.value);
  }
}
