import { test } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Slider page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getUrl(testConfig.pages.widgets.slider), {
      waitUntil: 'domcontentloaded',
    });
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