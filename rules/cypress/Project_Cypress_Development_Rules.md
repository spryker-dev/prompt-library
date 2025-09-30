---
globs: .cy.ts,.spec.ts,cypress/**/*.ts
alwaysApply: false
---

# Project Cypress Test Development Rules

## Basic Principles

- Tests are deterministic, isolated, and readable.
- Interact via user-visible behavior; avoid implementation details.
- Prefer resilient, semantic selectors over brittle DOM selectors.
- Top-level describe matches user story/feature; it states a clear behavior.
- Avoid visiting external sites directly: Instead, mock the network requests to avoid dependencies on external services and to speed up tests.
- Do not add more tests than asked - add only the tests that are requested in the prompt. DO NOT cover all acceptance criteria with tests - only write tests that are requested explicitly in the prompt.
- Do not update existing abstract classes without dire need

## Naming Conventions

- Use descriptive and meaningful names: Names should be self-explanatory and describe the purpose or function of the variable, function, or file.
- Use camelCase for variables and functions: Start with a lowercase letter and capitalize each subsequent word (e.g., myVariable, getUserName).
- Use PascalCase for classes and constructors: Start with an uppercase letter and capitalize each subsequent word (e.g., UserService, OrderProcessor).
- Use kebab-case for file and folder names: Use lowercase letters separated by hyphens (e.g., user-service.ts, order-processor.ts).
- Avoid abbreviations: Use full words to avoid confusion (e.g., authentication instead of auth).

## Test Repository Structure
- Test specs, page objects, scenarios and commands should be logically separated into subfolders based on the business feature they belong to
- Actions that involve several pages (e.g. click button on one page and then go to another page to see and adjust the result of that click) should be created as Scenarios in `cypress/support/scenarios`
- Actions within one application page (e.g. clicking a button on that page or editing a filed) should be created within the page object file for that page only - see storefront-product-details-page.ts as an example of page elements and actions inside a page objects
- In page object files create ONLY the page elements that are used in the tests, never try to cover all possible elements.
- Cypress.Commands.add should ONLY be used for cases when the action is not related to any application page: a background operation, a DB query, etc. Do not create Cypress.Commands.add to manipulate the page elements.

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
- If the new feature adds new elements on a page that already exists, e.g. shopping list feature adds `add to shopping list` button on PDP (Product Details Page), then you should update existing page object for PDP. The project should have exactly 1 page object for Shopping list details page and exactly 1 page object for PDP. There should be no additional page objects that deal with elements on either of these pages.

```typescript
// Good: Use data-qa attributes
cy.get('[data-qa="submit-button"]').click();
cy.get('[data-qa="user-name-input"]').type('john@example.com');

// Acceptable: Stable selectors
cy.get('#login-form input[type="email"]');
cy.get('.user-profile [data-testid="name"]');

// Bad: Fragile selectors
cy.get('div > div > button:nth-child(3)');
cy.get('.css-1234567');
cy.contains('Click here'); // text-based, language-dependent
```

## Test Specs
Test specs should not have hardcoded urls, test data or element selectors. Page objects should provide tech spec with selectors and urls, fixtures should provide the test data.

Test specs MUST NOT contain any direct cy.get(), cy.find(), or other Cypress element selection commands. All element interactions MUST be performed through page object getters and methods. Test specs should only contain:
- Page object method calls (e.g., pageObject.getButton().click())
- Assertions (e.g., pageObject.getElement().should('be.visible'))
- Test flow logic (e.g., cy.visit(), cy.url().should())

Forbidden in test specs:
- cy.get('[data-qa="..."]')
- cy.find('[data-qa="..."]')
- Any direct element selection

Required approach:
- Create getters in page objects for all elements
- Use page object methods for all interactions
- Test specs should read like business logic, not technical implementation

## Flake Prevention
- Hardcoded wait times MUST NOT be used in tests to improve reliability and reduce flakiness - DO NOT use `cy.wait()` where it can be avoided.
- Wait on app signals: cy.wait('@alias'), element state (should('be.visible')), route changes, toasts.
- Use Cypress’ retry ability; avoid extracting values out of the chain unless necessary.

## Fixtures & Test Data
- Test data MUST be specified in cypress/fixtures
- Test data MUST NOT be hardcoded inside the test
- Never commit secrets; use Cypress.env().

```typescript
// Good: Use fixtures and cleanup
beforeEach(() => {
  cy.task('db:seed');
  cy.fixture('users').as('userData');
});

beforeEach(() => {
  cy.task('db:cleanup');
});

```

## Assertions
- Test assertions MUST be kept short, and concise, and verifying a single specific business case.
- Prefer semantic assertions tied to user-observable behavior.
- One assertion focus per test; extra assertions must support the same behavior.
- Assert on toast/alert error messages when simulating failures.
- Assertions should not be present in page objects, or commands, all assertions should be inside test specs

## General Test Structure

- Use `beforeEach` or `before` for common preconditions (routes, auth, seed).
- Use `before` block to reset or clean up the test data created by previous tests, do not use `after` block for it
- Avoid using After and afterEach - cleaning state and other activities are better to do in before sections
- Keep tests independent; no shared mutable state across tests.

