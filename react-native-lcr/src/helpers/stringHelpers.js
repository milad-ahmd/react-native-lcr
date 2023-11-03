/**
 * Converts an integer into an array of bytes.
 *
 * @param  {str} string - The string to be converted
 */
export function stringToBytes(str) {
  var bytes = []
  
  for (var i =0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    bytes[i] = char;
  }
  // Null ASCI Code
  bytes[bytes.length] = 0xA;
  console.log(' ascii bytes',bytes);
  // bytes[bytes.length] = 10;
  // bytes[bytes.length+1] = 10;
  // bytes[bytes.length+2] = 10;
  // bytes[bytes.length+3] = 0xA;

  return bytes
}
