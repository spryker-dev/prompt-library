---
globs: .cy.ts,.spec.ts,cypress/**/*.ts
alwaysApply: false
---

# Cypress Test Development Rules for Projects

## Basic Principles

- Tests are deterministic, isolated, and readable.
- Interact via user-visible behavior; avoid implementation details.
- Prefer resilient, semantic selectors over brittle DOM selectors.
- Top-level describe matches user story/feature; it states a clear behavior.
- Avoid visiting external sites directly: Instead, mock the network requests to avoid dependencies on external services and to speed up tests.
- Do not add more tests than asked - add only the tests that are requested in the prompt
- Do not update existing abstract classes without dire need

## Naming Conventions

- Use descriptive and meaningful names: Names should be self-explanatory and describe the purpose or function of the variable, function, or file.
- Use camelCase for variables and functions: Start with a lowercase letter and capitalize each subsequent word (e.g., myVariable, getUserName).
- Use PascalCase for classes and constructors: Start with an uppercase letter and capitalize each subsequent word (e.g., UserService, OrderProcessor).
- Use kebab-case for file and folder names: Use lowercase letters separated by hyphens (e.g., user-service.ts, order-processor.ts).
- Avoid abbreviations: Use full words to avoid confusion (e.g., authentication instead of auth).

## Test Repository Structure
- Test specs, page objects, scenarios and commands should be logically separated into subfolders based on the business feature they belong to
- Complex reusable actions that use more than one application page SHOULD be created as Scenarios in `cypress/support/scenarios`
- Actions within one application page (e.g. clicking a button on that page or editing a filed) should be created within the page object file for that page only
- Actions that involve several pages (e.g. click button on one page and then go to another page to see and adjust the result of that click) should only be pplaces in scenario files
- Cypress command should ONLY be used for cases when

### Folder Structure:
```
cypress/
  e2e/                  # container for  test specifications
    backoffice/         # specifications *.cy.ts that test backoffice features are grouped here, further subdivided into folders by features
    glue/               # specifications *.cy.ts that test Glue API features are grouped here, further subdivided into folders by features
    merchant-portal/    # specifications *.cy.ts that test Merchant Portal features are grouped here, further subdivided into folders by features
    storefront/         #specifications *.cy.ts that test Storefront features are grouped here, further subdivided into folders by features
  fixtures/             # typed JSON fixtures that store test data
  support/
    cy-commands/        # *.ts files with custom commands that cannot be inside a scenario or a page object, e.g. a DB manipulation command
    glue-endpoints/     # *.ts files each of which contains ulrs, payload, test data references and headers for one specific API endpoint that can be reused inside a test
    page-objects/       # *.ts files each of which contains a page object - selectors and actions that are limited to a single application page
    scenarios/          # *.ts files that contain complex reusable scenarios that involve actions with more than one page object, so two or more application pages
    e2e.ts              # global setup, test libs
    index.d.ts          # TS augmentation for Cypress
```

## TypeScript & Config

- For TS config use existing `tsconfig.json`
- For Cypress config use existing `cypress.config.ts`
- for E2E config use existing `cypress/support/e2e.ts`

## Selectors & Page Objects

- MUST use one of these attributes for element selection when available: id, name, data-qa
- All selectors that belong to one application page and methods that use them MUST be created inside the relevant page object
- Each application page MUST exist as a separate page object in cypress/support/page-objects
- Stub external/unstable requests with cy.intercept; avoid real third-party calls in CI.
- Do not include `get` and `find` into the test spec file to reference page elements. They should be located in the corresponding Page object and test spec should access page elements using getters and setters of the corresponding page object. Test Spec should assert elements on the page 
- If the feature touches previously existing application pages by adding elements on them, update the page object for the touched page (only create a page object if there is no page object yet for the touched page). There MUST NOT be two or more page object files for the same application page.

## Flake Prevention
- Hardcoded wait times MUST NOT be used in tests to improve reliability and reduce flakiness - DO NOT use `cy.wait()` where it can be avoided.
- Wait on app signals: cy.wait('@alias'), element state (should('be.visible')), route changes, toasts.
- Use Cypress’ retry ability; avoid extracting values out of the chain unless necessary.

## Fixtures & Test Data
- Test data MUST be specified in cypress/fixtures
- Test data MUST NOT be hardcoded inside the test
- Never commit secrets; use Cypress.env().

## Assertions
- Test assertions MUST be kept short, and concise, and verifying a single specific business case.
- Prefer semantic assertions tied to user-observable behavior.
- One assertion focus per test; extra assertions must support the same behavior.
- Assert on toast/alert error messages when simulating failures.

## Test Structure

- Use `beforeEach` or `before` for common preconditions (routes, auth, seed).
- Use `before` block to reset or clean up the test data created by previous tests, do not use `after` block for it
- Avoid using After and afterEach - cleaning state and other activities are better to do in before sections
- Keep tests independent; no shared mutable state across tests.
