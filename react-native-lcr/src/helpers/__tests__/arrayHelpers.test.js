import { arraysEqual } from "../arrayHelpers"

describe("arrayHelpers", () => {
  describe("#arraysEqual", () => {
    it("identifies whether two arrays are the same", () => {
      let arr1 = [1, 2, 3]
      let arr2 = [1, 2, 3]
      expect(arraysEqual(arr1, arr2)).toEqual(true)

      let arr3 = [1, 2, 3]
      let arr4 = [1, 2, 2]
      expect(arraysEqual(arr3, arr4)).toEqual(false)

      let arr5 = [1, 2, 3]
      let arr6 = [1, 2, 3, 4]
      expect(arraysEqual(arr5, arr6)).toEqual(false)

      expect(arraysEqual(undefined, arr1)).toEqual(false)
    })
  })
})
