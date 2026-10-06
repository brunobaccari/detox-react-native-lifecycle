const { by, element, expect } = require('detox');

module.exports = {
  async expectWelcome() {
    await expect(element(by.id('welcome'))).toBeVisible();
    for (const button of ['hello_button', 'world_button', 'goodbye_button']) {
      await expect(element(by.id(button))).toBeVisible();
    }
  },
  async choose(button, message) {
    await element(by.id(button)).tap();
    await this.expectGreeting(message);
  },
  async expectGreeting(message) {
    await expect(element(by.text(message))).toBeVisible();
    await expect(element(by.id('welcome'))).not.toExist();
  }
};
