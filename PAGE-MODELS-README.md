# DemoQA Page Models

This project implements a **Page Object Model (POM)** pattern using Playwright and TypeScript, structured according to the architectural guidelines in `instructions.md`.

## Project Structure

```
page-model/
├── demoQA.ts              # Root facade - lazy-loads all page models
├── controls/              # Reusable UI control wrappers
│   ├── common-control.ts          # Base control with actions (click, hover, etc)
│   ├── common-control-verify.ts   # Base verification class
│   ├── button.ts / button-verify.ts
│   ├── text-box.ts / text-box-verify.ts
│   ├── check-box.ts / check-box-verify.ts
│   ├── radio-button.ts / radio-button-verify.ts
│   └── index.ts
├── common/                # Shared page components
│   ├── header.ts / header-verify.ts
│   ├── left-sidebar.ts / left-sidebar-verify.ts
│   └── index.ts
├── elements/              # Elements page models
│   ├── text-box-page.ts / text-box-page-verify.ts
│   ├── check-box-page.ts / check-box-page-verify.ts
│   ├── radio-button-page.ts / radio-button-page-verify.ts
│   ├── buttons-page.ts / buttons-page-verify.ts
│   ├── links-page.ts / links-page-verify.ts
│   └── index.ts
├── widgets/               # Widget page models
│   ├── date-picker-page.ts / date-picker-page-verify.ts
│   ├── slider-page.ts / slider-page-verify.ts
│   └── index.ts
├── forms/                 # Form page models
│   ├── practice-form-page.ts / practice-form-page-verify.ts
│   └── index.ts
└── interactions/          # Interaction page models (stub)

config.ts                 # Configuration file with base URL and page paths

utils/
├── decorators.ts          # @step decorator for test reporting

tests/
├── fixtures.ts            # Test fixture extending with demoQA
└── example.spec.ts        # Example tests demonstrating usage
```

## Architecture Overview

### 1. **Base Classes (Controls)**

#### `CommonControl` - Action Base Class
- Provides common actions: `click()`, `hover()`, `rightClick()`, `doubleClick()`
- Decorated with `@step()` for Playwright reporting

#### `CommonControlVerify` - Verification Base Class
- Provides common assertions: `disabled()`, `visible()`, `exists()`, `focused()`
- All verify classes inherit from this

### 2. **Control Hierarchy**

All UI controls follow an inheritance pattern:

```typescript
Button extends CommonControl
  └── has verify: ButtonVerify extends CommonControlVerify

TextBox extends CommonControl
  └── has verify: TextBoxVerify extends CommonControlVerify

CheckBox extends CommonControl
  └── has verify: CheckBoxVerify extends CommonControlVerify
```

**Example:**
```typescript
const button = new Button(
  this.page.locator('button'),
  'Submit Button'
);
await button.click();                    // From CommonControl
await button.verify.hasText('Submit');   // From ButtonVerify
```

### 3. **Page Models**

Page models **compose** controls and sub-components rather than inheriting:

```typescript
export class TextBoxPage {
  readonly verify: TextBoxPageVerify;
  
  private fullName?: TextBox;
  private email?: TextBox;

  get fullNameField(): TextBox {
    return (this.fullName ??= new TextBox(...));
  }

  async fillForm(fullName: string, email: string): Promise<void> {
    await this.fullNameField.typeText(fullName);
    // ... more actions
  }
}
```

**Key Principles:**
- Each page model is split into two files: action file and verify file
- Lazy initialization using getters (only creates what's needed)
- Composition over inheritance

### 4. **Facade Pattern - DemoQA**

The `demoQA.ts` file provides a single entry point for all page models:

```typescript
export class DemoQA {
  private _header?: Header;
  private _textBoxPage?: TextBoxPage;
  
  get header(): Header {
    return (this._header ??= new Header(this.page));
  }
  
  get textBoxPage(): TextBoxPage {
    return (this._textBoxPage ??= new TextBoxPage(this.page));
  }
}
```

**Benefits:**
- Lazy loading: Pages only instantiate when accessed
- Single point of access
- Easy to extend with new pages
- Memory efficient

## Usage

### Setup Fixture

The fixture in `tests/fixtures.ts` extends Playwright's test with the `demoQA` fixture:

```typescript
export const test = base.extend<{ demoQA: DemoQA }>({
  demoQA: async ({ page, browser }, use) => {
    const demoQA = new DemoQA(page, browser);
    await use(demoQA);
  },
});
```

### Writing Tests

```typescript
import { test, expect } from './fixtures';
import { getUrl, testConfig } from '../config';

test('should fill text box form', async ({ demoQA }) => {
  await demoQA.page.goto(getUrl(testConfig.pages.textBox));
  
  // Use page model through facade
  await demoQA.textBoxPage.fillForm('John Doe', 'john@example.com');
  await demoQA.textBoxPage.submit();
  
  // Verify using verify class
  await demoQA.textBoxPage.verify.outputContainsName('John Doe');
});
```

## Decorators

### `@step()` Decorator

Automatically wraps methods in `test.step()` for Playwright reporting. Supports templating:

```typescript
@step('Type "{{args[0]}}" into {{this}}')
async typeText(text: string): Promise<void> {
  await this.textBox.fill(text);
}
```

**Template Variables:**
- `{{args[n]}}` - nth argument
- `{{this}}` - result of `toString()`

## Configuration

The base URL and all page paths are centralized in `config.ts`. This makes it easy to manage test environments and page routes.

### Configuration File Structure

```typescript
// config.ts
export const testConfig = {
  baseUrl: 'https://demoqa.com',
  
  pages: {
    elements: '/elements',
    textBox: '/text-box',
    checkbox: '/checkbox',
    // ... more pages
    
    widgets: {
      datePicker: '/date-picker',
      slider: '/slider',
      // ... more widgets
    },
  },
};

export const getUrl = (path: string): string => {
  return `${testConfig.baseUrl}${path}`;
};
```

### Using Configuration in Tests

```typescript
import { getUrl, testConfig } from '../config';

test.beforeEach(async ({ page }) => {
  // Navigate using config
  await page.goto(getUrl(testConfig.pages.textBox));
});

// Or with nested pages
await page.goto(getUrl(testConfig.pages.widgets.slider));
```

### Changing Environment

To switch between environments, update `config.ts`:

```typescript
const ENV = process.env.TEST_ENV || 'production';

export const testConfig = {
  baseUrl: ENV === 'local' 
    ? 'http://localhost:3000'
    : 'https://demoqa.com',
  // ... rest of config
};
```

Or pass environment-specific config:

```typescript
// config.local.ts
export const testConfig = { baseUrl: 'http://localhost:3000', ... };

// config.prod.ts
export const testConfig = { baseUrl: 'https://demoqa.com', ... };
```

## Adding New Pages

### 1. Create Page Files

```typescript
// elements/upload-download-page.ts
export class UploadDownloadPage {
  readonly verify: UploadDownloadPageVerify;
  
  constructor(protected readonly page: Page) {
    this.locators = { /* ... */ };
    this.verify = new UploadDownloadPageVerify(this);
  }
  
  async uploadFile(filePath: string): Promise<void> {
    await this.locators.uploadInput.setInputFiles(filePath);
  }
}

// elements/upload-download-page-verify.ts
export class UploadDownloadPageVerify {
  async fileUploaded(fileName: string): Promise<void> {
    // assertions...
  }
}
```

### 2. Add to DemoQA Facade

```typescript
export class DemoQA {
  private _uploadDownloadPage?: UploadDownloadPage;
  
  get uploadDownloadPage(): UploadDownloadPage {
    return (this._uploadDownloadPage ??= new UploadDownloadPage(this.page));
  }
}
```

## Best Practices

1. **Lazy Initialization**: Use getters with nullish coalescing (`??=`)
2. **Single Responsibility**: Keep page models focused on one page
3. **Composition**: Compose controls and sub-components
4. **Naming**: Use descriptive names for locators and methods
5. **Verify Classes**: Always split actions and verifications
6. **Step Decorators**: Use `@step()` for clear test reporting
7. **Error Handling**: Let Playwright handle waits and retries

## Example Tests

See `tests/example.spec.ts` for complete examples demonstrating:
- Text box form filling
- Control verification
- Navigation
- Button interactions
- Form submission

## Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/example.spec.ts

# Run with UI mode
npx playwright test --ui

# Generate report
npx playwright show-report
```

## Future Enhancements

The current page models provide a foundation for:
- Web tables (data grid controls)
- Dynamic properties
- Upload/download
- Frames and nested frames
- Modal dialogs
- Alert handling
- Drag & drop interactions
- Book store application pages (login, books, profile)

These can be implemented following the same patterns established in this architecture.
