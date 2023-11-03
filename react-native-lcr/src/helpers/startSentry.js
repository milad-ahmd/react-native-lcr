import { Sentry } from "react-native-sentry"

export function startSentry() {
  if (!__DEV__) {
    Sentry.config(
      "https://83badfd1ead541e5a3fdf628b99b30e1:c91580b00e0e481ba938d897b6b8112c@sentry.io/157554",
    ).install()
  }
}
