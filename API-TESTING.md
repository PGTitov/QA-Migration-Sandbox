# API Testing Architecture and Strategy

## Architecture

API tests use a layered structure:

```text
tests
  -> resource services (accounts, users, books)
    -> ApiClient (shared Playwright APIRequestContext wrapper)
      -> DemoQA API
```

Typed request and response models live in `tests/api/models.ts`; runtime schema
guards are maintained in `tests/api/schemas.ts`. The runtime checks make
unexpected response shapes fail with a clear test error rather than relying
only on compile-time types. `tests/api/test-data.ts` provides factories for
unique account credentials and book collection payloads. `general-utils.ts`
composes the services into account provisioning and cleanup helpers.

## Test strategy

The API suites target Book Store and Account endpoints and currently include
38 endpoint-focused cases. The additional 34 page-response smoke cases in
`pages.spec.ts` check the HTML pages and are not included in that API count.
Coverage includes:

- Catalog and profile reads with schema checks and known-book reference data.
- Account creation, token generation, authorization, profile lookup, and
  deletion.
- Book collection add, replace, and removal workflows.
- Negative inputs for malformed ISBNs, missing account fields, invalid
  credentials, duplicate books, missing authorization, and unknown users.
- Data-driven cases for catalog lookup, credential, and account-payload
  variations.

The combined flow in `tests/qa/book-store.spec.ts` provisions an account via
the API, performs the book addition in the UI, and verifies the collection in
the profile. Its `afterEach` hook removes the book and account.

Run the API tests locally with:

```sh
npm run test:api -- --project=chromium
```

## CI integration

`.github/workflows/playwright.yml` runs on pushes, pull requests, and manual
dispatch. By default it runs both `tests/qa` and `tests/api`; manual dispatch
can select folders or a Playwright grep filter. Playwright publishes HTML and
JUnit reports, and the workflow uploads test results and the HTML report as
artifacts.

## API coverage gap analysis

| Area | Current evidence | Remaining gap / risk |
|---|---|---|
| Account CRUD | Create, authorize, token generation, read, and delete flows are exercised. | No account-update operation exists in the exposed API contract. |
| Book collection CRUD | Add, replace, read-back, and delete flows are exercised. | No explicit pagination, concurrency, or large-collection behavior is tested. |
| Input validation | Missing account fields, bad credentials, malformed/unknown ISBNs, duplicate ISBNs, empty ISBN lists, and unknown users are covered. | Boundary-length, Unicode, and broader malformed JSON cases are not covered. |
| Response contracts | Runtime checks validate book-list, book, user, token, and API error shapes. Known catalog fields are compared with `test-data/books.ts`. | The schemas are hand-maintained and do not yet validate every documented status/error response or every optional field. |
| Environments | The base URL is configurable through `BASE_URL`. | CI currently uses the public DemoQA service; no isolated mock/staging API or contract-version pin is configured. |
| Operational behavior | CI retains Playwright HTML, JUnit, and test-result artifacts. | Rate limiting, service outages, and long-running performance behavior are outside the current suite. |

Address the gaps based on product risk and a stable API test environment; do not
turn transient public-service behavior into brittle assertions.
