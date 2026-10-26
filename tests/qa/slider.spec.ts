import { test } from '../fixtures';

test.describe('DemoQA Slider page', () => {
  test.beforeEach(async ({ demoQA }) => {
    await demoQA.sliderPage.open();
  });

  test('setting a value updates the slider', async ({ demoQA }) => {
    const sliderValue = '50';

    await test.step('1. Verify the slider is visible', async () => {
      await demoQA.sliderPage.verify.sliderIsVisible();
    });

    await test.step('2. Set the slider value', async () => {
      await demoQA.sliderPage.setSliderValue(sliderValue);
    });

    await test.step('3. Verify the slider value', async () => {
      await demoQA.sliderPage.verify.sliderValueIs(sliderValue);
    });
  });
});