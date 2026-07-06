import { Locator } from '@playwright/test';
import { step } from '../../utils/decorators';

/**
 * Base class for all UI controls providing common actions
 */
export abstract class CommonControl {
  constructor(protected selector: Locator) {}

  @step('Click on {{this}}')
  async click(): Promise<void> {
    await this.selector.click({ force: true });
  }

  @step('Hover over {{this}}')
  async hover(): Promise<void> {
    await this.selector.hover();
  }

  @step('Right click on {{this}}')
  async rightClick(): Promise<void> {
    await this.selector.click({ button: 'right', force: true });
  }

  @step('Double click on {{this}}')
  async doubleClick(): Promise<void> {
    await this.selector.dblclick({ force: true });
  }

  abstract toString(): string;
}
