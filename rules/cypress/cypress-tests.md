---
description: Comprehensive Cypress testing guidelines for TypeScript projects
globs: *.spec.ts,*.cy.ts,**/cypress/**/*.ts
alwaysApply: false
---
# Cypress Testing Rules for TypeScript

## What Should Be Tested

### Critical User Journeys
- Complete end-to-end workflows that users follow
- Authentication and authorization flows
- Core business functionality and features
- Payment and checkout processes
- Data submission and form handling
- Cross-browser compatibility issues
- Responsive design on different viewports

### Integration Points
- API integrations with external services
- Database interactions through the UI
- Third-party service integrations
- Real user interactions with actual data
- Multi-step processes requiring user sessions

### Business Logic Through UI
- Complex calculations displayed to users
- Conditional UI behavior based on user roles
- Workflow state transitions
- Data validation feedback
- Error handling and user notifications

## What Should NOT Be Tested

### Unit-Level Logic
- Individual function implementations (use unit tests)
- Pure mathematical calculations (use unit tests)
- Component-level state management (use component tests)
- API endpoint logic (use integration tests)
- Database queries (use backend tests)

### External Dependencies
- Third-party service reliability
- External API functionality
- Browser-specific bugs (unless critical)
- Performance benchmarking (use dedicated tools)
- Security vulnerabilities (use security testing tools)

### Low-Value Scenarios
- Static content display
- CSS styling details (unless functional)
- Hover effects and animations
- Browser dev tools functionality
- Scenarios covered by lower-level tests

## Test Structure and Organization

### File Naming and Organization
```typescript
// Good: Descriptive and grouped by feature
cypress/e2e/backoffice/auth/user-login.cy.ts
cypress/e2e/backoffice/checkout/payment-flow.cy.ts
cypress/e2e/backoffice/admin/user-management.cy.ts

// Bad: Generic or unclear naming
cypress/e2e/test1.cy.ts
cypress/e2e/stuff.cy.ts
cypress/e2e/random-tests.cy.ts
```

### Test Naming Conventions
```typescript
// Good: Descriptive and behavior-focused
describe('User Authentication', () => {
  it('should allow valid user to login successfully', () => {});
  it('should display error message for invalid credentials', () => {});
  it('should redirect to dashboard after successful login', () => {});
});

// Bad: Implementation-focused or vague
describe('Login Tests', () => {
  it('should test login', () => {});
  it('should click button', () => {});
  it('should work', () => {});
});
```

## Best Practices

### Test Design Principles
- **Arrange-Act-Assert Pattern**: Structure tests clearly
- **Test Independence**: Each test should run in isolation
- **Deterministic Tests**: Tests should produce consistent results
- **Single Responsibility**: One test should verify one behavior
- **Clear Intent**: Test name and implementation should be self-explanatory

### Element Selection
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

### Wait Strategies
```typescript
// Good: Wait for specific conditions
cy.get('[data-qa="loading-spinner"]').should('not.exist');
cy.get('[data-qa="data-table"]').should('contain', 'John Doe');
cy.intercept('GET', '/api/users').as('getUsers');
cy.wait('@getUsers');

// Bad: Arbitrary waits
cy.wait(5000);
cy.wait(1000).then(() => { /* test logic */ });
```

### Page Object Pattern
```typescript
// Good: Encapsulate page interactions
class LoginPage {
  private emailInput = '[data-qa="email-input"]';
  private passwordInput = '[data-qa="password-input"]';
  private submitButton = '[data-qa="login-submit"]';

  visitPage(): void {
    cy.visit('/login');
  }

  enterCredentials(email: string, password: string): void {
    cy.get(this.emailInput).type(email);
    cy.get(this.passwordInput).type(password);
  }

  submitForm(): void {
    cy.get(this.submitButton).click();
  }

  shouldShowErrorMessage(message: string): void {
    cy.get('[data-qa="error-message"]').should('contain', message);
  }
}

// Usage in test
const loginPage = new LoginPage();

it('should display error for invalid credentials', () => {
  loginPage.visitPage();
  loginPage.enterCredentials('invalid@email.com', 'wrongpassword');
  loginPage.submitForm();
  loginPage.shouldShowErrorMessage('Invalid credentials');
});
```

### Data Management
```typescript
// Good: Use fixtures and cleanup
beforeEach(() => {
  cy.task('db:seed');
  cy.fixture('users').as('userData');
});

afterEach(() => {
  cy.task('db:cleanup');
});

it('should create new user', function() {
  cy.visit('/admin/users');
  cy.get('[data-qa="add-user-button"]').click();
  cy.get('[data-qa="user-name"]').type(this.userData.validUser.name);
  // ... rest of test
});

// Bad: Hardcoded data and no cleanup
it('should create new user', () => {
  cy.visit('/admin/users');
  cy.get('[data-qa="add-user-button"]').click();
  cy.get('[data-qa="user-name"]').type('John Doe'); // hardcoded
  // ... test continues without cleanup
});
```

## Common Anti-Patterns to Avoid

### Don't Use Cypress for Unit Testing
```typescript
// Bad: Testing individual functions
it('should calculate total price correctly', () => {
  const result = calculateTotal([10, 20, 30]);
  expect(result).to.equal(60);
});

// Good: Test the behavior through UI
it('should display correct total in shopping cart', () => {
  cy.addItemToCart('Product A', 10);
  cy.addItemToCart('Product B', 20);
  cy.get('[data-qa="cart-total"]').should('contain', '$30.00');
});
```

### Don't Test Implementation Details
```typescript
// Bad: Testing internal state
it('should set loading state to true', () => {
  cy.window().its('app.state.loading').should('be.true');
});

// Good: Test user-visible behavior
it('should show loading indicator while processing', () => {
  cy.get('[data-qa="submit-button"]').click();
  cy.get('[data-qa="loading-spinner"]').should('be.visible');
});
```

### Don't Create Overly Complex Tests
```typescript
// Bad: Testing too many scenarios in one test
it('should handle complete user workflow', () => {
  // Login
  cy.visit('/login');
  cy.get('[data-qa="email"]').type('user@example.com');
  // ... login logic
  
  // Profile update
  cy.visit('/profile');
  cy.get('[data-qa="name"]').clear().type('New Name');
  // ... profile logic
  
  // Shopping
  cy.visit('/shop');
  cy.get('[data-qa="product-1"]').click();
  // ... shopping logic
  
  // Checkout
  cy.visit('/checkout');
  // ... checkout logic
});

// Good: Separate focused tests
describe('User Workflow', () => {
  it('should allow user to login successfully', () => {
    // focused login test
  });
  
  it('should allow user to update profile', () => {
    // focused profile test
  });
  
  it('should allow user to complete purchase', () => {
    // focused checkout test
  });
});
```

## TypeScript-Specific Guidelines

### Type Definitions
```typescript
// Good: Define types for test data
interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface TestFixtures {
  users: User[];
  products: Product[];
}

// Good: Type custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(userType: 'admin' | 'user' | 'guest'): Chainable<void>;
      createUser(userData: User): Chainable<void>;
    }
  }
}
```

### Custom Commands
```typescript
// cypress/support/commands.ts
Cypress.Commands.add('loginAs', (userType: 'admin' | 'user' | 'guest') => {
  const users = {
    admin: { email: 'admin@test.com', password: 'admin123' },
    user: { email: 'user@test.com', password: 'user123' },
    guest: { email: 'guest@test.com', password: 'guest123' }
  };

  const user = users[userType];
  cy.visit('/login');
  cy.get('[data-qa="email-input"]').type(user.email);
  cy.get('[data-qa="password-input"]').type(user.password);
  cy.get('[data-qa="login-submit"]').click();
  cy.url().should('not.include', '/login');
});
```

## Error Handling and Debugging

### Meaningful Assertions
```typescript
// Good: Specific and informative assertions
cy.get('[data-qa="user-list"]')
  .should('exist')
  .and('contain', 'John Doe')
  .and('not.contain', 'Loading...');

cy.get('[data-qa="form-errors"]')
  .should('be.visible')
  .and('contain', 'Email is required');

// Bad: Vague assertions
cy.get('[data-qa="content"]').should('exist');
cy.get('div').should('be.visible');
```

### Test Debugging
```typescript
// Good: Add helpful debugging information
it('should process payment successfully', () => {
  cy.log('Starting payment test with test card');
  
  cy.get('[data-qa="card-number"]').type('4242424242424242');
  cy.get('[data-qa="expiry"]').type('12/25');
  cy.get('[data-qa="cvc"]').type('123');
  
  cy.log('Submitting payment form');
  cy.get('[data-qa="pay-button"]').click();
  
  cy.log('Verifying payment success');
  cy.get('[data-qa="success-message"]')
    .should('be.visible')
    .and('contain', 'Payment processed successfully');
});
```

## Performance Considerations

### Efficient Test Execution
```typescript
// Good: Minimize network requests
beforeEach(() => {
  cy.intercept('GET', '/api/**', { fixture: 'api-responses.json' });
});

// Good: Use baseUrl and relative paths
cy.visit('/dashboard'); // instead of cy.visit('http://localhost:3000/dashboard')

// Good: Set up authentication state programmatically
Cypress.Commands.add('loginByAPI', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password }
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token);
  });
});
```

## Test Maintenance

### Regular Review and Refactoring
- Remove obsolete tests when features are removed
- Update selectors when UI changes
- Consolidate duplicate test logic into helpers
- Keep test data and fixtures up to date
- Review test execution time and optimize slow tests

### Documentation
- Comment complex test logic
- Maintain README with test execution instructions
- Document custom commands and their usage
- Keep track of test coverage for critical paths