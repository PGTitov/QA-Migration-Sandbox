# Quick Start Guide - DemoQA Page Models

## 5-Minute Setup

### 1. Import the Fixture and Config

```typescript
import { test, expect } from './tests/fixtures';
import { getUrl, testConfig } from './config';
```

### 2. Use the Facade with Config URLs

```typescript
test('example test', async ({ demoQA }) => {
  await demoQA.page.goto(getUrl(testConfig.pages.textBox));
  
  // Interact with page
  await demoQA.textBoxPage.fillForm('John', 'john@test.com');
  
  // Verify with assertions
  await demoQA.textBoxPage.verify.outputContainsName('John');
});
```

## Available Pages & Examples

### Elements
```typescript
// Text Box
await demoQA.textBoxPage.fillForm(fullName, email);
await demoQA.textBoxPage.verify.outputContainsName(fullName);

// CheckBox
await demoQA.checkBoxPage.expandAll();
await demoQA.checkBoxPage.checkItem('Desktop');
await demoQA.checkBoxPage.verify.itemIsSelected('Desktop');

// Radio Button
await demoQA.radioButtonPage.selectOption('Yes');
await demoQA.radioButtonPage.verify.resultShows('You have selected Yes');

// Buttons
await demoQA.buttonsPage.performDoubleClick();
await demoQA.buttonsPage.verify.messageContains('You have double clicked');

// Links
await demoQA.linksPage.clickLink('created');
await demoQA.linksPage.verify.linkStatusCodeIs('201');
```

### Widgets
```typescript
// Date Picker
await demoQA.datePickerPage.openDatePicker();
await demoQA.datePickerPage.selectDateInPicker('15');
await demoQA.datePickerPage.verify.datePickerIsVisible();

// Slider
await demoQA.sliderPage.setSliderValue('50');
await demoQA.sliderPage.verify.sliderValueIs('50');
```

### Forms
```typescript
// Practice Form
await demoQA.practiceFormPage.fillBasicInfo('Jane', 'Smith');
await demoQA.practiceFormPage.selectGender('female');
await demoQA.practiceFormPage.enterMobileNumber('1234567890');
await demoQA.practiceFormPage.submit();
await demoQA.practiceFormPage.verify.successMessageAppears();
```

### Navigation
```typescript
// Header
await demoQA.header.navigateToHome();
await demoQA.header.verify.logoIsVisible();

// Sidebar
await demoQA.sidebar.navigateToPage('text-box');
await demoQA.sidebar.expandSection('Elements');
await demoQA.sidebar.clickMenuItem('Text Box');
```

## Common Patterns

### Fill and Submit
```typescript
await demoQA.textBoxPage.fillForm('data1', 'data2', 'data3');
await demoQA.textBoxPage.submit();
await demoQA.textBoxPage.verify.successMessageAppears();
```

### Navigate and Interact
```typescript
await demoQA.sidebar.navigateToPage('buttons');
await demoQA.buttonsPage.performDoubleClick();
await demoQA.buttonsPage.verify.actionMessageAppears();
```

### Verify Multiple Items
```typescript
await demoQA.checkBoxPage.checkItem('Item1');
await demoQA.checkBoxPage.checkItem('Item2');
const items = await demoQA.checkBoxPage.getSelectedItems();
expect(items).toContain('Item1');
```

## Accessing Raw Locators

If you need to access the underlying Playwright locator:

```typescript
// All pages have locators property
const locator = demoQA.textBoxPage.locators.submitButton;
await locator.click();

// Controls expose locator
const selector = demoQA.textBoxPage.fullNameField.textBox;
```

## Accessing Page Object

```typescript
// Use the underlying Playwright page
await demoQA.page.goto('https://demoqa.com');
await demoQA.page.waitForLoadState('networkidle');
```

## Adding a Custom Action

Extend an existing page:

```typescript
// In your test file
const customFillForm = async (page, name, email) => {
  await page.textBoxPage.fillForm(name, email);
  // Add custom logic
};

await customFillForm(demoQA, 'John', 'john@test.com');
```

## Configuration

The base URL and all page paths are centralized in `config.ts`:

```typescript
import { testConfig, getUrl } from './config';

// Access base URL
const baseUrl = testConfig.baseUrl;  // 'https://demoqa.com'

// Navigate to pages
await page.goto(getUrl(testConfig.pages.textBox));           // /text-box
await page.goto(getUrl(testConfig.pages.widgets.slider));    // /slider
await page.goto(getUrl(testConfig.pages.forms));             // /automation-practice-form

// All available pages are organized by category:
testConfig.pages.elements.*           // Element pages
testConfig.pages.widgets.*            // Widget pages  
testConfig.pages.alerts.*             // Alert/Frame/Window pages
testConfig.pages.interactions.*       // Interaction pages
testConfig.pages.bookStore.*          // Book store pages
```

**To change the base URL**, edit `config.ts`:
```typescript
export const testConfig = {
  baseUrl: 'https://your-custom-domain.com',  // Change here
  // ... rest of config
};
```

## Tips & Tricks

✅ **Use IDE autocomplete**: All methods are fully typed  
✅ **Check example.spec.ts**: See working test examples  
✅ **Read PAGE-MODELS-README.md**: Comprehensive documentation  
✅ **Use test.step()**: Pages already use @step decorators  
✅ **Lazy loading**: Pages only load when accessed  

## Common Issues

### Issue: Page not found
```
Error: locator not found
```
**Solution**: Verify page URL or use `demoQA.page.waitForSelector()`

### Issue: Stale element
```
Error: element is detached from the DOM
```
**Solution**: Page models handle this automatically

### Issue: Element not visible
```
Error: element is not visible
```
**Solution**: Use navigation methods to reach the page first

## Running Tests

```bash
# All tests
npx playwright test

# Specific file
npx playwright test tests/example.spec.ts

# With UI
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

## Example Test File

```typescript
import { test, expect } from './tests/fixtures';
import { getUrl, testConfig } from './config';

test.describe('DemoQA Text Box', () => {
  test.beforeEach(async ({ demoQA }) => {
    await demoQA.page.goto(getUrl(testConfig.pages.textBox));
  });

  test('should fill and submit form', async ({ demoQA }) => {
    // Arrange
    const name = 'John Doe';
    const email = 'john@example.com';
    
    // Act
    await demoQA.textBoxPage.fillForm(name, email);
    await demoQA.textBoxPage.submit();
    
    // Assert
    await demoQA.textBoxPage.verify.outputContainsName(name);
    await demoQA.textBoxPage.verify.outputContainsEmail(email);
  });
});
```

## Need More Info?

📖 See **PAGE-MODELS-README.md** for:
- Complete API reference
- Architecture details
- Best practices
- How to add new pages

📝 See **IMPLEMENTATION-SUMMARY.md** for:
- Overview of all created files
- Design patterns used
- Future enhancement ideas
- Benefits summary

## Support

When extending the framework:

1. Follow existing patterns for new pages
2. Always split actions and verifications
3. Use @step() decorator for test reporting
4. Implement lazy loading in facade
5. Keep page models focused on single page
