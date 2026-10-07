require('dotenv').config({ quiet: true });

module.exports = {
  testRunner: { args: { $0: 'jest', config: 'e2e/jest.config.js' }, jest: { setupTimeout: 120000 } },
  artifacts: { rootDir: 'results/detox', plugins: { screenshot: { shouldTakeAutomaticSnapshots: true, keepOnlyFailedTestsArtifacts: false, takeWhen: { testStart: false, testDone: true } }, log: 'failing' } },
  apps: {
    release: {
      type: 'android.apk',
      binaryPath: '.app/android/app/build/outputs/apk/release/app-release.apk',
      testBinaryPath: '.app/android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk',
      build: 'cd .app/android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release -PreactNativeArchitectures=x86_64 --no-daemon --max-workers=2'
    }
  },
  devices: { attached: { type: 'android.attached', device: { adbName: process.env.ANDROID_DEVICE || 'emulator-5554' } } },
  configurations: { 'android.attached.release': { device: 'attached', app: 'release' } }
};
