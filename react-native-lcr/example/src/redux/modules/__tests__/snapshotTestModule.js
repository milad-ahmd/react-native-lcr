import diff from "deep-diff"

/**
 * Snapshot tests a collection of action creators and their effects on a reducer.
 *
 * @param {String}    name      the module name
 * @param {Function}  reducer   the reducer to snapshot test
 * @param {[Object]}  actions   the actions to snapshot test
 */
export default function snapshotTestModule({ name, reducer, actions, resetState }) {
  describe(name + " module", () => {
    for (const [actionName, action] of Object.entries(actions)) {
      let initialState = {}
      if (resetState) {
        initialState = resetState(actionName)
      }
      describe("reducer", () => {
        describe("#" + actionName, () => {
          it("matches snapshot", () => {
            const result = reducer(initialState, action)
            expect(diff(initialState, result)).toMatchSnapshot()
          })
        })
      })
    }
  })

  describe("action creators", () => {
    for (const [actionName, action] of Object.entries(actions)) {
      describe(actionName, () => {
        it("matches snapshot", () => {
          expect(action).toMatchSnapshot()
        })
      })
    }
  })
}
