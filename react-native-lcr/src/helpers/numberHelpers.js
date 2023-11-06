/**
 * Converts an integer into an array of bytes.
 *
 * @param  {Integer} number - The number to be converted
 * @param  {Integer} length - The amount of bytes to return
 * @return {Array} - An array of decimals representing byte values
 */
export function numberToBytes(number, length) {
  var bytes = [];
  for (var i = length - 1; i >= 0; i--) {
    bytes[i] = number & 255;
    number = number >> 8;
  }

  return bytes;
}

export function floatToBytes(float) {
  let buffer = new ArrayBuffer(4);
  let intView = new Int32Array(buffer);
  let floatView = new Float32Array(buffer);

  floatView[0] = float;
  return numberToBytes(intView[0], 4);
}

/**
 * @param  {String} amount - The amount as a string
 * @param  {Integer} decimalPlaces - The number of places after the decimal point
 * @return {String} - The amount formatted with the correct number of decimal places
 */
export function formatAmountWithDecimalPlaces(amount, decimalPlaces) {
  let floatAmount = parseFloat(amount);
  return floatAmount.toFixed(decimalPlaces);
}
