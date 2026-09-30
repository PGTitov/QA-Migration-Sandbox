import { faker } from '@faker-js/faker';
import type { WebTableRecord } from '../page-model/elements';

export interface PracticeFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export const createWebTableRecord = (
  overrides: Partial<WebTableRecord> = {}
): WebTableRecord => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: `e2e-${faker.string.uuid()}@example.com`,
  age: '28',
  salary: '50000',
  department: 'Quality Assurance',
  ...overrides,
});

export const createWebTableLifecycleData = () => ({
  originalRecord: createWebTableRecord(),
  updatedRecord: createWebTableRecord({
    age: '29',
    salary: '55000',
    department: 'Support',
  }),
});

export const createPracticeFormData = (
  overrides: Partial<PracticeFormData> = {}
): PracticeFormData => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  mobile: faker.string.numeric(10),
  ...overrides,
});

export const checkboxBranchData = {
  parent: 'Office',
  childToUncheck: 'Public',
  selectedChildren: ['office', 'public', 'private'],
  remainingChildren: ['private'],
} as const;