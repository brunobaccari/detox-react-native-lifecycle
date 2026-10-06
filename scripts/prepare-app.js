const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
require('dotenv').config({ quiet: true });

const root = path.resolve(__dirname, '..');
const upstream = path.join(root, '.upstream');
const app = path.join(root, '.app');
const sample = 'examples/demo-react-native';
const ref = process.env.APP_SOURCE_REF;
if (!/^[a-f0-9]{40}$/.test(ref || '')) throw new Error('APP_SOURCE_REF must be a full commit SHA');
if (!fs.existsSync(upstream)) {
  execFileSync('git', ['clone', '--filter=blob:none', '--no-checkout', process.env.APP_SOURCE_URL, upstream], { stdio: 'inherit' });
}
for (const args of [['sparse-checkout', 'set', sample], ['checkout', '--detach', ref]]) {
  execFileSync('git', ['-C', upstream, ...args], { stdio: 'inherit' });
}
if (execFileSync('git', ['-C', upstream, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() !== ref) {
  throw new Error('Unexpected application revision');
}
if (fs.existsSync(app)) throw new Error('.app already exists; use a fresh checkout or inspect it before rebuilding');
fs.cpSync(path.join(upstream, sample), app, { recursive: true });
fs.symlinkSync(path.join(root, 'node_modules'), path.join(app, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
fs.copyFileSync(path.join(root, 'package.json'), path.join(app, 'package.json'));
fs.writeFileSync(path.join(app, 'babel.config.json'), JSON.stringify({ presets: ['module:@react-native/babel-preset'] }));
const build = path.join(app, 'android/build.gradle');
const original = fs.readFileSync(build, 'utf8');
const expected = "apply from: '../../../detox/android/rninfo.gradle'";
if (!original.includes(expected)) throw new Error('Upstream Gradle layout changed');
fs.writeFileSync(build, original.replace(expected, "apply from: '../node_modules/detox/android/rninfo.gradle'"));
const appBuild = path.join(app, 'android/app/build.gradle');
let content = fs.readFileSync(appBuild, 'utf8');
content = content.replace("androidTestImplementation 'com.wix:detox:+'", "androidTestImplementation 'com.wix:detox:20.51.4'");
content = content.replace("testInstrumentationRunner 'com.example.DetoxTestAppJUnitRunner'", "testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'");
content = content.replace("    androidTestImplementation 'com.github.wix-incubator:detox-butler:1.0.4'", '');
fs.writeFileSync(appBuild, content);
fs.unlinkSync(path.join(app, 'android/app/src/androidTest/java/com/example/DetoxTestAppJUnitRunner.java'));
console.log(`Prepared official Detox sample at ${ref}; application behavior unchanged.`);
