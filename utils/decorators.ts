import { test } from '@playwright/test';

/**
 * Step decorator for Playwright test reporting
 * Supports Nunjucks-style templating: {{args[0]}}, {{this}}, etc.
 */
export function step(description: string) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    const originalDescriptor = descriptor ?? Object.getOwnPropertyDescriptor(target, propertyKey);

    if (!originalDescriptor || typeof originalDescriptor.value !== 'function') {
      return descriptor;
    }

    const originalMethod = originalDescriptor.value;

    originalDescriptor.value = async function (...args: any[]) {
      let stepDescription = description;

      // Replace {{args[n]}} with actual arguments
      stepDescription = stepDescription.replace(/\{\{args\[(\d+)\]\}\}/g, (match, index) => {
        return String(args[parseInt(index)]);
      });

      // Replace {{this}} with toString() result
      stepDescription = stepDescription.replace(/\{\{this\}\}/g, () => {
        return String(this);
      });

      return test.step(stepDescription, async () => {
        return originalMethod.apply(this, args);
      });
    };

    return originalDescriptor;
  };
}
