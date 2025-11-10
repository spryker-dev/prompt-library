# Spryker Functional Test Generator Without Additional Rules/Instructions

## Description

A prompt for creating comprehensive functional tests for Spryker components (facades, plugins, etc.) without mocking, using real database interactions and testing helpers.

## Prompt Description

This prompt helps developers create complete functional tests for Spryker components including facades, plugins, and other entities. It follows the Arrange/Act/Assert pattern with real database interaction instead of mocks, utilizing existing testing helpers where possible. Use this prompt when no specific testing rules or instructions are provided for the model being tested.

## Tags (comma-separated)
functional-testing, codeception, spryker, facade-testing, plugin-testing, integration-testing

## When to Use

When you need to create functional tests for Spryker components (facades, plugins, or other entities) that interact with the database and require real data preparation instead of mocks. This prompt is particularly useful when no specific testing rules or instructions are provided for the component being tested.

Note: If data builders or helpers with data preparation are not needed for your test case, you can exclude those parts from the implementation.

## Prompt

```text
Create a single Functional test for {COMPONENT_TYPE}::{METHOD_NAME}() following these requirements:

1. Place the test in {TEST_DIRECTORY_PATH}
2. To prepare data use existing testing helpers where possible, e.g. {HELPER_NAME}, if not possible - create a method in Tester class. If method can be reused - introduce helper.
3. Do not mock anything - use data prepared with helpers.
4. Run 'docker/sdk testing codecept build' to generate Tester actions from configuration.
5. If possible - use a data provider to test all scenarios, including negative.
6. Follow the Arrange/Act/Assert pattern with real database interaction instead of mocks.
7. Before implementation check how tests are implemented in {REFERENCE_MODULE_PATH}.
8. Use databuilders if required, example: {DATABUILDER_EXAMPLE_PATH}. They require running "docker/sdk cli console transfer:databuilder:generate".
9. To validate test is ok, run: "docker/sdk testing codecept run", provide test name as a group and module codeception.yml as a config (reference {CODECEPTION_CONFIG_PATH}).
```

## Example Usage

```text
Create a single Functional test for SalesOrderAmendmentFacade::expandQuoteWithOriginalOrder() following these requirements:

1. Place the test in src/Spryker/SalesOrderAmendment/tests/SprykerTest/Zed/SalesOrderAmendment/Business/Facade/
2. To prepare data use existing testing helpers where possible, e.g. \SprykerTest\Shared\Sales\Helper\SalesDataHelper, if not possible - create a method in Tester class. If method can be reused - introduce helper.
3. Do not mock anything - use data prepared with helpers.
4. Run 'docker/sdk testing codecept build' to generate Tester actions from configuration.
5. If possible - use a data provider to test all scenarios, including negative.
6. Follow the Arrange/Act/Assert pattern with real database interaction instead of mocks
7.Before implementation check how tests are implemented in src/Spryker/Sales/tests/SprykerTest/Zed/Sales/Business/SalesFacadeTest.php
8. Use databuilders if required, example: src/Spryker/Sales/tests/_data/sales.databuilder.xml. They require running "docker/sdk cli console transfer:databuilder:generate".
9. To validate test is ok, run: "docker/sdk testing codecept run", provide test name as a group and module codeception.yml as a config (reference src/Spryker/Sales/codeception.yml).
```

## Example Output

```php
<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

namespace SprykerTest\Zed\SalesOrderAmendment\Business\Facade;

use Codeception\Test\Unit;
use Generated\Shared\DataBuilder\QuoteBuilder;
use Generated\Shared\Transfer\CustomerTransfer;
use Generated\Shared\Transfer\QuoteTransfer;
use Spryker\Shared\Kernel\Transfer\Exception\NullValueException;
use SprykerTest\Zed\SalesOrderAmendment\SalesOrderAmendmentBusinessTester;

/**
 * Auto-generated group annotations
 *
 * @group SprykerTest
 * @group Zed
 * @group SalesOrderAmendment
 * @group Business
 * @group Facade
 * @group ExpandQuoteWithOriginalOrderTest
 * Add your own group annotations below this line
 */
class ExpandQuoteWithOriginalOrderTest extends Unit
{
    protected SalesOrderAmendmentBusinessTester $tester;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tester->configureTestStateMachine([$this->tester::DEFAULT_OMS_PROCESS_NAME]);
    }

    /**
     * @dataProvider expandQuoteWithOriginalOrderDataProvider
     */
    public function testExpandQuoteWithOriginalOrder(
        array $quoteData,
        bool $shouldFindOrder,
        ?string $expectedExceptionClass = null,
        ?string $expectedExceptionMessage = null
    ): void {
        // Arrange
        $customerTransfer = $this->tester->haveCustomer();
        $orderTransfer = null;

        if ($shouldFindOrder) {
            $orderTransfer = $this->tester->haveOrderFromQuote(
                $this->tester->createQuoteTransfer($customerTransfer),
                $this->tester::DEFAULT_OMS_PROCESS_NAME
            );
            $quoteData[QuoteTransfer::AMENDMENT_ORDER_REFERENCE] = $orderTransfer->getOrderReference();
        }

        $quoteData[QuoteTransfer::CUSTOMER_REFERENCE] = array_key_exists(QuoteTransfer::CUSTOMER_REFERENCE, $quoteData)
            ? $quoteData[QuoteTransfer::CUSTOMER_REFERENCE]
            : $customerTransfer->getCustomerReference();

        $quoteTransfer = (new QuoteBuilder($quoteData))->build();

        // Assert (for exception cases)
        if ($expectedExceptionClass) {
            $this->expectException($expectedExceptionClass);
            if ($expectedExceptionMessage) {
                $this->expectExceptionMessage($expectedExceptionMessage);
            }
        }

        // Act
        $resultQuoteTransfer = $this->tester->getFacade()->expandQuoteWithOriginalOrder($quoteTransfer);

        // Assert (for success cases)
        if (!$expectedExceptionClass) {
            if ($shouldFindOrder) {
                $this->assertNotNull($resultQuoteTransfer->getOriginalOrder());
                $this->assertSame(
                    $orderTransfer->getIdSalesOrder(),
                    $resultQuoteTransfer->getOriginalOrder()->getIdSalesOrder()
                );
                $this->assertSame(
                    $orderTransfer->getOrderReference(),
                    $resultQuoteTransfer->getOriginalOrder()->getOrderReference()
                );
            } else {
                $this->assertNull($resultQuoteTransfer->getOriginalOrder());
            }
        }
    }

    public function testExpandQuoteWithOriginalOrderSuccessWithExistingOrder(): void
    {
        // Arrange
        $customerTransfer = $this->tester->haveCustomer();
        $orderTransfer = $this->tester->haveOrderFromQuote(
            $this->tester->createQuoteTransfer($customerTransfer),
            $this->tester::DEFAULT_OMS_PROCESS_NAME
        );

        $quoteTransfer = (new QuoteBuilder([
            QuoteTransfer::CUSTOMER_REFERENCE => $customerTransfer->getCustomerReference(),
            QuoteTransfer::AMENDMENT_ORDER_REFERENCE => $orderTransfer->getOrderReference(),
        ]))->build();

        // Act
        $resultQuoteTransfer = $this->tester->getFacade()->expandQuoteWithOriginalOrder($quoteTransfer);

        // Assert
        $this->assertNotNull($resultQuoteTransfer->getOriginalOrder());
        $this->assertSame($orderTransfer->getIdSalesOrder(), $resultQuoteTransfer->getOriginalOrder()->getIdSalesOrder());
        $this->assertSame($orderTransfer->getOrderReference(), $resultQuoteTransfer->getOriginalOrder()->getOrderReference());
    }

    public function testExpandQuoteWithOriginalOrderReturnsNullWhenOrderNotFound(): void
    {
        // Arrange
        $customerTransfer = $this->tester->haveCustomer();
        $quoteTransfer = (new QuoteBuilder([
            QuoteTransfer::CUSTOMER_REFERENCE => $customerTransfer->getCustomerReference(),
            QuoteTransfer::AMENDMENT_ORDER_REFERENCE => 'non-existing-order-reference',
        ]))->build();

        // Act
        $resultQuoteTransfer = $this->tester->getFacade()->expandQuoteWithOriginalOrder($quoteTransfer);

        // Assert
        $this->assertNull($resultQuoteTransfer->getOriginalOrder());
    }

    public function testExpandQuoteWithOriginalOrderReturnsNullWhenCustomerMismatch(): void
    {
        // Arrange
        $customerTransfer1 = $this->tester->haveCustomer();
        $customerTransfer2 = $this->tester->haveCustomer();

        $orderTransfer = $this->tester->haveOrderFromQuote(
            $this->tester->createQuoteTransfer($customerTransfer1),
            $this->tester::DEFAULT_OMS_PROCESS_NAME
        );

        $quoteTransfer = (new QuoteBuilder([
            QuoteTransfer::CUSTOMER_REFERENCE => $customerTransfer2->getCustomerReference(),
            QuoteTransfer::AMENDMENT_ORDER_REFERENCE => $orderTransfer->getOrderReference(),
        ]))->build();

        // Act
        $resultQuoteTransfer = $this->tester->getFacade()->expandQuoteWithOriginalOrder($quoteTransfer);

        // Assert
        $this->assertNull($resultQuoteTransfer->getOriginalOrder());
    }

    protected function expandQuoteWithOriginalOrderDataProvider(): array
    {
        return [
            'successful expansion with existing order' => [
                [QuoteTransfer::AMENDMENT_ORDER_REFERENCE => 'will-be-set-dynamically'],
                true,
                null,
                null,
            ],
            'returns null when order not found' => [
                [QuoteTransfer::AMENDMENT_ORDER_REFERENCE => 'non-existing-order-reference'],
                false,
                null,
                null,
            ],
            'throws exception when amendmentOrderReference is null' => [
                [QuoteTransfer::AMENDMENT_ORDER_REFERENCE => null],
                false,
                NullValueException::class,
                'Property "amendmentOrderReference" of transfer `Generated\Shared\Transfer\QuoteTransfer` is null.',
            ],
            'throws exception when customerReference is null' => [
                [
                    QuoteTransfer::AMENDMENT_ORDER_REFERENCE => 'some-order-reference',
                    QuoteTransfer::CUSTOMER_REFERENCE => null,
                ],
                false,
                NullValueException::class,
                'Property "customerReference" of transfer `Generated\Shared\Transfer\QuoteTransfer` is null.',
            ],
        ];
    }
}

```
codeception.yml
```yaml
namespace: SprykerTest\Zed\SalesOrderAmendment
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
        actor: SalesOrderAmendmentBusinessTester
        modules:
            enabled:
                - Asserts
                - \SprykerTest\Shared\Testify\Helper\Environment
                - \SprykerTest\Shared\Testify\Helper\ConfigHelper
                - \SprykerTest\Shared\Testify\Helper\LocatorHelper
                - \SprykerTest\Shared\Testify\Helper\DependencyHelper
                - \SprykerTest\Shared\Testify\Helper\DataCleanupHelper
                - \SprykerTest\Shared\Propel\Helper\TransactionHelper
                - \SprykerTest\Zed\SalesOrderAmendment\Helper\SalesOrderAmendmentHelper

```

### LLM
Claude 4 Sonnet

### AI Assistant
VS Code + GitHub Copilot

### Author
@geronica
