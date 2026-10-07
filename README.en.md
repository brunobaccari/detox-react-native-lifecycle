# Detox — React Native state and lifecycle

[Versão em português](README.md)

Gray-box tests against the official [Wix Detox 20.51.4 React Native sample](https://github.com/wix/Detox/tree/02f32837c74e19b7410b10976d360e1d6571f435/examples/demo-react-native). The app comes from the commit pinned in `.env`; its logic is not reimplemented here. Detox synchronization stays enabled.

## Coverage

Three choices display distinct greetings and remove the initial controls. Two lifecycle tests check that the greeting survives background/resume but resets after process termination, followed by a new successful selection. Each case starts a fresh instance.

This is a small in-memory state example, not checkout or backend validation. No sleeps, global synchronization disabling or retries to hide flakiness.

## Android run

Node 24, Java 17, Python 3.13 for the summary, Android SDK and an API 35 emulator. Build on Linux, as provided by the workflow.

```bash
cp .env.example .env
npm ci
npm run prepare:app
npm run build:android
npm run test:android
```

Set `ANDROID_DEVICE` from `adb devices`. Preparation checks out an exact upstream commit, copies the sample into `.app`, uses this repository's lockfile and adapts monorepo paths/instrumentation. It leaves `app.js` and application behavior unchanged. A release build bundles JavaScript, so Metro is not needed alongside the tests.

`e2e/pages` holds reused interactions/assertions; `e2e/lifecycle.test.js` defines the five cases. `.app`, `.upstream`, APKs and generated results are ignored. For another preparation, use a fresh checkout or inspect those directories before removing them.

## CI and limits

[Actions](https://github.com/brunobaccari/detox-react-native-lifecycle/actions) builds both APKs before starting the emulator. The summary lists each case; `android-results` retains JUnit, per-scenario summary with duration, screenshots at the end of every test and Detox failure logs for 14 days. All five cases must execute and pass; an empty report, failure or skip fails the gate.

No production integration, durable persistence or iOS execution is claimed. The official sample is intentionally small; this portfolio demonstrates lifecycle semantics and framework operation. Third-party build dependencies have their own update cycle.
