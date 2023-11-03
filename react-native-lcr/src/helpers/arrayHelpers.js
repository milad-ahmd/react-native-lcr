/**
 * @param  {Array} array1 - The first array to be compared.
 * @param  {Array} array2 - The second array to be compared.
 * @return {Bool} - Whether or not each element in each array is the same.
 */
export function arraysEqual(array1, array2) {
  if (!array1 || !array2) {
    return false
  }
  if (array1.length != array2.length) {
    return false
  }

  let compare
  try {
    compare = array1.map((element, index) => element == array2[index])
  } catch (error) {
    return false
  }
  return !compare.includes(false)
}
