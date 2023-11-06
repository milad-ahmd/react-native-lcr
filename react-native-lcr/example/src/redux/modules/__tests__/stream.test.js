import { actions, reducer, initialState } from "../stream"
import StreamStatus from "~/api/StreamStatus"
import snapshotTestModule from "./snapshotTestModule"
const { setStreamStatus, connectToStream } = actions

snapshotTestModule({
  name: "stream",
  reducer,
  actions: {
    setStreamStatus: setStreamStatus(StreamStatus.Connected),
    connectToStream: connectToStream(),
  },
  resetState: () => {
    return { ...initialState }
  },
})
