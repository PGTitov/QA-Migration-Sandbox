import { test } from '../fixtures';
import { getUrl, testConfig } from '../../config';

test.describe('DemoQA Slider page', () => {
  test('setting a value updates the slider', async ({ demoQA, page }) => {
    await page.goto(getUrl(testConfig.pages.widgets.slider), {
      waitUntil: 'domcontentloaded',
    });

    await demoQA.sliderPage.verify.sliderIsVisible();
    await demoQA.sliderPage.setSliderValue('50');
    await demoQA.sliderPage.verify.sliderValueIs('50');
  });
});