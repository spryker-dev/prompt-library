# Spryker Functional Test Generator with Existing Rules/Instructions

## Description

A lighter version of the functional test generator prompt for creating comprehensive functional tests for Spryker components (facades, plugins, etc.) without mocking, using real database interactions and testing helpers. This version can be used together with specific functional test rules provided separately.

## Prompt Description

This prompt helps developers create complete functional tests for Spryker components including facades, plugins, and other entities. It follows the Arrange/Act/Assert pattern with real database interaction instead of mocks, utilizing existing testing helpers where possible. This is a simplified version of the functional test generator that can be used in conjunction with specific rule files that are provided separately.

## Tags (comma-separated)
functional-testing, codeception, spryker, facade-testing, plugin-testing, integration-testing

## When to Use

When you need to create functional tests for Spryker components (facades, plugins, or other entities) that interact with the database and require real data preparation instead of mocks. This prompt is particularly useful when you have specific rule files that you want to apply to your tests, as it provides a simpler template that can be combined with those rules.

Note: If data builders or helpers with data preparation are not needed for your test case, you can exclude those parts from the implementation.

## Prompt

```text
Create a single Functional test for {COMPONENT_TYPE}::{METHOD_NAME}() following these requirements:

1. Place the test in {TEST_DIRECTORY_PATH}
2. Do not mock anything - use prepared with helpers data from database.
3. Use a data provider to test all scenarios, including negative
4. Use databuilders if required, example: {DATABUILDER_EXAMPLE_PATH}. Use functional test rules: {RULE_FILE}.
```

## Example Usage

```text
Create a single Functional test for SalesOrderAmendmentFacade::getSalesOrderAmendmentQuoteCollection() following these requirements:

1. Place the test in vendor/spryker/spryker/Bundles/SalesOrderAmendment/tests/SprykerTest/Zed/SalesOrderAmendment/Business/Facade/
2. Do not mock anything - use prepared with helpers data from database.
3. Use a data provider to test all scenarios, including negative
4. Use databuilders if required, example: vendor/spryker/spryker/Bundles/Sales/tests/_data/sales.databuilder.xml. Use functional test rules: {ruleFile}.
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
use Generated\Shared\DataBuilder\SalesOrderAmendmentQuoteBuilder;
use Generated\Shared\Transfer\PaginationTransfer;
use Generated\Shared\Transfer\SalesOrderAmendmentQuoteConditionsTransfer;
use Generated\Shared\Transfer\SalesOrderAmendmentQuoteCriteriaTransfer;
use Generated\Shared\Transfer\SalesOrderAmendmentQuoteTransfer;
use Generated\Shared\Transfer\SortTransfer;

/**
 * Auto-generated group annotations
 *
 * @group SprykerTest
 * @group Zed
 * @group SalesOrderAmendment
 * @group Business
 * @group Facade
 * @group SalesOrderAmendmentFacadeGetSalesOrderAmendmentQuoteCollectionTest
 * Add your own group annotations below this line
 */
class SalesOrderAmendmentFacadeGetSalesOrderAmendmentQuoteCollectionTest extends Unit
{
    /**
     * @var string
     */
    protected const STORE_NAME = 'DE';

    /**
     * @var string
     */
    protected const CUSTOMER_REFERENCE = 'TEST_CUSTOMER';

    /**
     * @var string
     */
    protected const AMENDMENT_ORDER_REFERENCE = 'TEST_ORDER_REF';

    /**
     * @var string
     */
    protected const FIELD_CREATED_AT = 'created_at';

    /**
     * @var \SprykerTest\Zed\SalesOrderAmendment\SalesOrderAmendmentBusinessTester
     */
    protected $tester;

    /**
     * @dataProvider getSalesOrderAmendmentQuoteCollectionDataProvider
     *
     * @param array $salesOrderAmendmentQuoteData
     * @param \Generated\Shared\Transfer\SalesOrderAmendmentQuoteCriteriaTransfer $salesOrderAmendmentQuoteCriteriaTransfer
     * @param int $expectedCount
     *
     * @return void
     */
    public function testGetSalesOrderAmendmentQuoteCollectionShouldReturnCorrectQuotes(
        array $salesOrderAmendmentQuoteData,
        SalesOrderAmendmentQuoteCriteriaTransfer $salesOrderAmendmentQuoteCriteriaTransfer,
        int $expectedCount
    ): void {
        // Arrange
        foreach ($salesOrderAmendmentQuoteData as $quoteData) {
            $this->tester->haveSalesOrderAmendmentQuote($quoteData);
        }

        // Act
        $salesOrderAmendmentQuoteCollectionTransfer = $this->tester->getFacade()
            ->getSalesOrderAmendmentQuoteCollection($salesOrderAmendmentQuoteCriteriaTransfer);

        // Assert
        $this->assertCount(
            $expectedCount,
            $salesOrderAmendmentQuoteCollectionTransfer->getSalesOrderAmendmentQuotes(),
        );

        if ($expectedCount > 0) {
            $this->assertInstanceOf(
                SalesOrderAmendmentQuoteTransfer::class,
                $salesOrderAmendmentQuoteCollectionTransfer->getSalesOrderAmendmentQuotes()->getIterator()->current(),
            );
        }
    }

    /**
     * @return array
     */
    public function getSalesOrderAmendmentQuoteCollectionDataProvider(): array
    {
        return [
            'Should return empty collection when no quotes exist' => [
                [],
                new SalesOrderAmendmentQuoteCriteriaTransfer(),
                0,
            ],
            'Should return all quotes when no criteria is specified' => [
                [
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE,
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE,
                    ],
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE . '2',
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE . '2',
                    ],
                ],
                new SalesOrderAmendmentQuoteCriteriaTransfer(),
                2,
            ],
            'Should filter quotes by customer reference' => [
                [
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE,
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE,
                    ],
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE . '2',
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE . '2',
                    ],
                ],
                (new SalesOrderAmendmentQuoteCriteriaTransfer())
                    ->setSalesOrderAmendmentQuoteConditions(
                        (new SalesOrderAmendmentQuoteConditionsTransfer())
                            ->setCustomerReferences([static::CUSTOMER_REFERENCE])
                    ),
                1,
            ],
            'Should filter quotes by amendment order reference' => [
                [
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE,
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE,
                    ],
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE . '2',
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE . '2',
                    ],
                ],
                (new SalesOrderAmendmentQuoteCriteriaTransfer())
                    ->setSalesOrderAmendmentQuoteConditions(
                        (new SalesOrderAmendmentQuoteConditionsTransfer())
                            ->setAmendmentOrderReferences([static::AMENDMENT_ORDER_REFERENCE . '2'])
                    ),
                1,
            ],
            'Should filter quotes by store name' => [
                [
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE,
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE,
                    ],
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => 'AT',
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE . '2',
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE . '2',
                    ],
                ],
                (new SalesOrderAmendmentQuoteCriteriaTransfer())
                    ->setSalesOrderAmendmentQuoteConditions(
                        (new SalesOrderAmendmentQuoteConditionsTransfer())
                            ->setStoreNames(['AT'])
                    ),
                1,
            ],
            'Should paginate results with limit and offset' => [
                [
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE,
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE,
                    ],
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE . '2',
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE . '2',
                    ],
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE . '3',
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE . '3',
                    ],
                ],
                (new SalesOrderAmendmentQuoteCriteriaTransfer())
                    ->setPagination(
                        (new PaginationTransfer())
                            ->setLimit(1)
                            ->setOffset(1)
                    ),
                1,
            ],
            'Should sort results' => [
                [
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE,
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE,
                    ],
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE . '2',
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE . '2',
                    ],
                ],
                (new SalesOrderAmendmentQuoteCriteriaTransfer())
                    ->addSort(
                        (new SortTransfer())
                            ->setField(static::FIELD_CREATED_AT)
                            ->setIsAscending(false)
                    ),
                2,
            ],
            'Should return empty collection when filtering by non-existent ID' => [
                [
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE,
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE,
                    ],
                ],
                (new SalesOrderAmendmentQuoteCriteriaTransfer())
                    ->setSalesOrderAmendmentQuoteConditions(
                        (new SalesOrderAmendmentQuoteConditionsTransfer())
                            ->setSalesOrderAmendmentQuoteIds([999999])
                    ),
                0,
            ],
            'Should filter by multiple criteria (AND condition)' => [
                [
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => static::STORE_NAME,
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE,
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE,
                    ],
                    [
                        SalesOrderAmendmentQuoteTransfer::STORE => 'AT',
                        SalesOrderAmendmentQuoteTransfer::CUSTOMER_REFERENCE => static::CUSTOMER_REFERENCE,
                        SalesOrderAmendmentQuoteTransfer::AMENDMENT_ORDER_REFERENCE => static::AMENDMENT_ORDER_REFERENCE . '2',
                    ],
                ],
                (new SalesOrderAmendmentQuoteCriteriaTransfer())
                    ->setSalesOrderAmendmentQuoteConditions(
                        (new SalesOrderAmendmentQuoteConditionsTransfer())
                            ->setCustomerReferences([static::CUSTOMER_REFERENCE])
                            ->setStoreNames([static::STORE_NAME])
                    ),
                1,
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
Claude 3.7 Sonnet

### AI Assistant
Windsurf Cascade

### Author
@geronica
