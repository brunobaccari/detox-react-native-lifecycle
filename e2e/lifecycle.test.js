const { device } = require('detox');
const greeting = require('./pages/GreetingPage');

describe('React Native greeting state', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
    await greeting.expectWelcome();
  });

  test.each([
    ['hello_button', 'Hello!!!'],
    ['world_button', 'World!!!'],
    ['goodbye_button', 'Goodbye, World!!!']
  ])('%s renders its own message and removes the choices', async (button, message) => {
    await greeting.choose(button, message);
  });

  test('background and resume keep the current React state', async () => {
    await greeting.choose('world_button', 'World!!!');
    await device.sendToHome();
    await device.launchApp({ newInstance: false });
    await greeting.expectGreeting('World!!!');
  });

  test('process restart resets the non-persistent greeting', async () => {
    await greeting.choose('hello_button', 'Hello!!!');
    await device.terminateApp();
    await device.launchApp({ newInstance: true });
    await greeting.expectWelcome();
    await greeting.choose('goodbye_button', 'Goodbye, World!!!');
  });
});
