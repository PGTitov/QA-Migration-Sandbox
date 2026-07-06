import { test } from '@playwright/test';

/**
 * Step decorator for Playwright test reporting
 * Supports Nunjucks-style templating: {{args[0]}}, {{this}}, etc.
 */
export function step(description: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
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

    return descriptor;
  };
}
