export default class StreamQueueStub {
  constructor() {
    super.constructor()
    this.reject = false
    this.responses = []
  }

  queue(body, toNode) {
    this.body = body
    this.toNode = toNode
    return new Promise((resolve, reject) => {
      if (this.reject) {
        reject("error")
        return
      }
      resolve(this.responses.shift())
    })
  }
}
