# Spryker Functional Testing Guide

## Introduction

This guide provides rules and best practices for writing functional tests in Spryker to improve the development experience. Functional tests verify that components of the system work together correctly and meet business requirements. In Spryker, functional tests are organized by application layers (Zed, Client, Yves, Glue) and use Codeception as the testing framework.

Note that modules typically contain multiple types of tests, not just functional tests. These can include:
- Unit tests (testing individual components in isolation)
- Integration tests (testing interactions between components)
- Functional tests (testing complete features)
- API tests (testing API endpoints)

## Test Structure

### Directory Structure

Tests in Spryker follow a specific directory structure:

```
tests/
├── SprykerTest/                  # Core module tests
│   ├── Zed/                      # Backend tests
│   │   └── ModuleName/
│   │       ├── Business/         # Business layer tests
│   │       │   └── Facade/       # Facade tests
│   │       ├── Communication/    # Communication layer tests
│   │       ├── Persistence/      # Persistence layer tests
│   │       ├── Presentation/     # UI tests
│   │       ├── _support/         # Support classes
│   │       │   ├── Helper/       # Test helpers
│   │       │   └── PageObject/   # Page objects for UI tests
│   │       └── codeception.yml   # Layer configuration
│   ├── Client/                   # Client layer tests
│   │   └── ModuleName/
│   ├── Service/                  # Service layer tests
│   │   └── ModuleName/
│   ├── Glue/                     # API tests
│   │   └── ModuleName/
│   └── Shared/                   # Shared functionality tests
│       └── ModuleName/
└── PyzTest/                      # Project-specific tests
    ├── Zed/
    ├── Yves/
    └── Glue/
```

### Test Class Structure

Each test class should:

1. Extend the appropriate base test class (usually `Codeception\Test\Unit`)
2. Include proper group annotations for test filtering
3. Have a protected tester property with the appropriate type
4. Follow the AAA pattern (Arrange, Act, Assert) for test methods

Example:

```php
/**
 * Auto-generated group annotations
 *
 * @group SprykerTest
 * @group Zed
 * @group ModuleName
 * @group Business
 * @group Facade
 * @group YourTestName
 * Add your own group annotations below this line
 */
class YourTestNameTest extends Unit
{
    /**
     * @var \SprykerTest\Zed\ModuleName\ModuleNameBusinessTester
     */
    protected $tester;

    /**
     * @return void
     */
    public function testSomeFunctionality(): void
    {
        // Arrange
        $data = $this->tester->prepareTestData();

        // Act
        $result = $this->tester->getFacade()->testedMethod($data);

        // Assert
        $this->assertTrue($result);
    }
}
```

### Test Method Structure (AAA Pattern)

Every test method should clearly follow the Arrange-Act-Assert (AAA) pattern with comments separating each section:

## Layer-Specific Testing

### Zed Layer Tests

Zed tests are divided into sublayers:

1. **Business Layer Tests**: Test business logic through the Facade
   - Focus on testing business rules, calculations, and workflows
   - Use mocks for external dependencies

2. **Communication Layer Tests**: Test controllers, forms, and plugins
   - Test request handling and response generation
   - Verify plugin behavior

### Client Layer Tests

Client tests verify:
- Client methods that communicate with Zed
- Storage operations
- Search operations
- Plugin stack execution

### Service Layer Tests

Service tests verify stateless operations that don't require database access.

### Shared Layer Tests

Shared tests verify functionality used across multiple application layers.

## Test Data Preparation

### Data Helpers

Data helpers are essential for preparing test data. They should:

1. Create necessary database records
2. Handle dependencies between entities
3. Clean up data after tests
4. Provide methods for common data creation scenarios

Example from PriceProduct:

```php
public function havePriceProduct(array $priceProductOverride = []): PriceProductTransfer
{
    $priceProductFacade = $this->getPriceProductFacade();

    $priceProductTransfer = $this->createPriceProductTransfer(
        $priceProductOverride,
        static::NET_PRICE,
        static::GROSS_PRICE,
        static::EUR_ISO_CODE,
    );

    $priceProductTransfer = $priceProductFacade->createPriceForProduct($priceProductTransfer);

    $this->getDataCleanupHelper()->_addCleanup(function () use ($priceProductTransfer): void {
        $this->cleanupPriceProductStore($priceProductTransfer->getIdPriceProduct());
        $this->cleanupPriceProduct($priceProductTransfer->getIdPriceProduct());
    });

    return $priceProductTransfer;
}
```

### Data Builders

When working with data builders:

1. **Use existing builders when possible** - Check if there are existing data builders for the transfer objects you need
2. Create data builder XML schemas in `tests/_data` directory only when necessary
3. Generate data builders with `docker/sdk testing console transfer:databuilder:generate`
4. Use builders to create transfers with test data

Creating new data builders is only necessary when you need to test with specific transfer objects that don't have existing builders.

## Test Helpers

### Where to Find Test Helpers

Test helpers in Spryker are located in several places:

1. **Core Testify Module**: `/vendor/spryker/spryker/Bundles/Testify/tests/SprykerTest/Shared/Testify/_support/Helper/`
   - Contains base helpers used across all modules

2. **Module-Specific Helpers**: `/vendor/spryker/spryker/Bundles/ModuleName/tests/SprykerTest/Shared/ModuleName/_support/Helper/`
   - Contains helpers specific to a particular module

3. **Layer-Specific Helpers**:
   - Zed/Client/Yves: `/vendor/spryker/spryker/Bundles/Testify/tests/SprykerTest/{Layer}/Testify/_support/Helper/`

4. **Project-Specific Helpers**: `/tests/PyzTest/Shared/Testify/_support/Helper/`
   - Contains custom helpers for project-specific testing needs

### Creating Custom Helpers

You can create custom helpers when you need reusable testing functionality:

1. **When to create a custom helper**:
   - When you have functionality that will be used across multiple test cases
   - When you need to encapsulate complex test setup or verification logic
   - When you want to extend existing helper functionality

2. **Structure of a custom helper**:
   - Extend `Codeception\Module` or an existing helper
   - Implement methods that encapsulate the reusable functionality
   - Add proper documentation for the helper methods

Example of a custom helper:

```php
namespace SprykerTest\Shared\YourModule\Helper;

use Codeception\Module;

class YourCustomHelper extends Module
{
    /**
     * Creates test data needed for your specific tests
     *
     * @param array $overrideData
     *
     * @return \Generated\Shared\Transfer\YourTransfer
     */
    public function createTestData(array $overrideData = []): YourTransfer
    {
        // Implementation
    }
}
```

If the functionality is only used within a single test class, it's better to keep it in the tester class rather than creating a separate helper.

### Common Helpers

1. **ConfigHelper**: Mock configurations and access ModuleConfig
2. **DependencyHelper**: Mock dependencies between modules
3. **TransactionHelper**: Wrap tests in database transactions
4. **DataCleanupHelper**: Clean up test data
5. **LocatorHelper**: Access facades, query containers, and other module components

### Layer-Specific Helpers

1. **BusinessHelper**: Mock and access business layer classes
2. **CommunicationHelper**: Mock and access communication layer classes
3. **PublishAndSynchronizeHelper**: Test publish and synchronize processes

## Best Practices

1. **Isolation**: Tests should be independent and not rely on the state from other tests
2. **Focused**: Each test should verify a single behavior or feature
3. **Readable**: Test names should clearly describe what they test
4. **Maintainable**: Use helpers and builders to reduce code duplication
5. **Fast**: Tests should execute quickly to provide rapid feedback
6. **Reliable**: Tests should produce the same result on every run
7. **Complete**: Cover both happy paths and edge cases

## Common Patterns

### Testing Facades

1. Get the facade through the tester
2. Prepare test data using helpers
3. Call the facade method
4. Assert the expected result

```php
public function testFacadeMethod(): void
{
    // Arrange
    $data = $this->tester->prepareTestData();

    // Act
    $result = $this->tester->getFacade()->facadeMethod($data);

    // Assert
    $this->assertNotEmpty($result);
}
```

### Testing with Mocks

1. Create mocks for dependencies
2. Set up expectations on the mocks
3. Inject mocks into the tested class
4. Execute the test
5. Verify mock expectations

```php
public function testWithMocks(): void
{
    // Arrange
    $dependencyMock = $this->createMock(DependencyInterface::class);
    $dependencyMock->expects($this->once())
        ->method('someMethod')
        ->willReturn('expected result');

    $this->tester->setDependency(
        ModuleDependencyProvider::SOME_DEPENDENCY,
        $dependencyMock
    );

    // Act
    $result = $this->tester->getFacade()->methodUsingDependency();

    // Assert
    $this->assertEquals('expected result', $result);
}
```

### Testing Plugins

1. Create a plugin instance
2. Call the plugin method
3. Assert the expected behavior

```php
public function testPlugin(): void
{
    // Arrange
    $plugin = new YourPlugin();
    $transfer = new SomeTransfer();

    // Act
    $result = $plugin->process($transfer);

    // Assert
    $this->assertTrue($result);
}
```

## Configuration

### Codeception Configuration

Each module should have a `codeception.yml` file that defines:

1. Namespace for tests
2. Paths for tests, data, support, and output
3. Coverage settings
4. Test suites with their specific configurations
5. Required helpers and modules

Example:

```yaml
namespace: SprykerTest\Zed\ModuleName
paths:
    tests: .
    data: ../../../_data
    support: _support
    output: ../../../_output

coverage:
    enabled: true
    remote: false
    whitelist: { include: ['../../../../src/*'] }

suites:
    Business:
        path: Business
        actor: ModuleNameBusinessTester
        modules:
            enabled:
                - Asserts
                - \SprykerTest\Shared\Testify\Helper\Environment
                - \SprykerTest\Shared\Testify\Helper\ConfigHelper
                - \SprykerTest\Shared\Testify\Helper\LocatorHelper
                - \SprykerTest\Shared\Testify\Helper\DependencyHelper
                - \SprykerTest\Shared\Testify\Helper\DataCleanupHelper
                - \SprykerTest\Shared\Propel\Helper\TransactionHelper
                # Add other required helpers here
```

### Running Tests

Run tests using Codeception commands:

Run specific test: `docker/sdk testing codecept run tests/SprykerTest/Zed/ModuleName/Business/SomeTest.php`

## Setting Up New Tests

When introducing tests for a new module, follow these steps:

1. Create the appropriate directory structure for your tests
2. Create a `codeception.yml` file for the module
3. Define test suites in the configuration
4. Create tester classes and helper classes as needed
5. **Run `docker/sdk testing codecept build` command** to generate required support classes:
   ```
   docker/sdk testing codecept build -c tests/SprykerTest/Zed/YourModule
   ```
6. Write your test classes following the AAA pattern
7. Run the tests to verify they work correctly

The `codecept build` step is crucial as it generates the necessary tester classes and actions based on your configuration. Always run this command after creating new test modules or making changes to the test configuration.
