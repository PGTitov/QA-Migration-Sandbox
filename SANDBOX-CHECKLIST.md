# Sandbox Completion Checklist

This repository implements the automated portion of the Manual QA to Web Automation QAE sandbox. Completion still requires learner evidence and tutor review; passing tests alone is not a promotion decision.

## Automated project baseline

- [x] TypeScript Playwright project with centralized configuration.
- [x] `npm test` runs the complete suite.
- [x] `npm run test:chromium -- tests/qa/check-box.spec.ts` runs a focused slice.
- [x] `npm run typecheck` checks the project without emitting files.
- [x] HTML report, screenshots, videos, and traces are configured for failure analysis.
- [x] Chromium, Firefox, WebKit, and Mobile Chrome projects are configured.
- [x] Tests use an explicit navigation or a local `beforeEach`; fixtures do not hide page navigation.
- [x] Page models, controls, verification classes, fixtures, and test data have separate responsibilities.

## Junior evidence to collect

- [ ] Entry self-check or small JavaScript/TypeScript practice example.
- [ ] Project tree and successful terminal and VS Code execution evidence.
- [ ] Three to five baseline tests and two to three practical scenarios.
- [ ] One debug/fix example with the failure artifact and explanation.
- [ ] Locator and assertion rationale in the learner's own words.
- [ ] One AI-assisted task documenting accepted, rejected, and manually changed output.
- [ ] Dedicated Git branch with readable incremental commits pushed for review.

## Middle evidence to collect

- [ ] Before/after refactoring with an explanation of the trade-off.
- [ ] A page object or component improvement and a reusable helper or flow.
- [ ] A useful fixture or shared setup example.
- [ ] Three to five independently designed end-to-end scenarios, including relevant negative coverage.
- [ ] One instability investigation showing root cause, fix, and before/after behavior.
- [ ] Coverage-gap analysis with proposed next automation candidates.
- [ ] One validated AI-assisted workflow using refined prompts where needed.
- [ ] Dedicated Git branch with readable incremental commits pushed for review.

## Review gate

A tutor or SME should review task completion, learner understanding, code quality, automation quality, and independence. The learner must explain locators, assertions, data, fixtures, abstractions, failure causes, and the reasoning behind design decisions.

## Useful commands

```text
npm test
npm run test:chromium
npm run test:headed
npm run test:debug
npm run typecheck
npm run report
```

Set `BASE_URL` to target another environment. The default is `https://demoqa.com`.
