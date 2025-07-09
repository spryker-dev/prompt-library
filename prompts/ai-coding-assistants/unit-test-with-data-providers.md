# Unit Test with Data Providers

## Description

A prompt for writing comprehensive unit tests using data providers to cover all possible conditions and edge cases in a structured, maintainable way.

## Prompt Description

This prompt helps developers create thorough unit tests that utilize data providers to systematically test different scenarios, including positive cases, negative cases, and edge conditions. It emphasizes avoiding code duplication and organizing tests in a clean, readable manner.

## When to Use

- When you need comprehensive test coverage for a method with multiple conditions
- When testing methods that need to handle various input scenarios
- When you want to avoid repetitive test code and use data-driven testing
- When you need to test both positive and negative scenarios systematically
- When testing methods that should throw exceptions under certain conditions

## Prompt

```text
Write a unit test for {CLASS_NAME}::{METHOD_NAME}() using a data provider. Each condition should be covered in a separate case. Include all possible both positive and negative scenarios. Also do not forget to cover edge cases and expected exceptions (e.g. missing {EXCEPTION_CONTEXT}). Avoid code duplication and try to combine everything in 1–2 test methods.
```

## Example Usage

```text
Write a unit test for DiscountEligibilityChecker::isEligible() using a data provider. Each condition should be covered in a separate case. Include all possible both positive and negative scenarios. Also do not forget to cover edge cases and expected exceptions (e.g. missing store in QuoteTransfer). Avoid code duplication and try to combine everything in 1–2 test methods.
```

## Example Output

```php
class DiscountEligibilityCheckerTest extends Unit
{
    private DiscountEligibilityChecker $discountEligibilityChecker;

    protected function setUp(): void
    {
        $this->discountEligibilityChecker = new DiscountEligibilityChecker();
    }

    /**
     * @dataProvider eligibilityDataProvider
     */
    public function testIsEligible(
        DiscountTransfer $discountTransfer,
        QuoteTransfer $quoteTransfer,
        bool $expectedResult,
        ?string $expectedException = null
    ): void {
        if ($expectedException) {
            $this->expectException($expectedException);
        }

        $result = $this->discountEligibilityChecker->isEligible($discountTransfer, $quoteTransfer);

        $this->assertSame($expectedResult, $result);
    }

    public function eligibilityDataProvider(): array
    {
        return [
            'eligible - all conditions met' => [
                $this->createDiscountTransfer('DISCOUNT_CODE', true, 'DE', 'EUR'),
                $this->createQuoteTransfer('GUEST', 50, 'DE', 'EUR'),
                true,
            ],
            'not eligible - discount not active' => [
                $this->createDiscountTransfer('DISCOUNT_CODE', false, 'DE', 'EUR'),
                $this->createQuoteTransfer('GUEST', 50, 'DE', 'EUR'),
                false,
            ],
            'not eligible - store mismatch' => [
                $this->createDiscountTransfer('DISCOUNT_CODE', true, 'US', 'USD'),
                $this->createQuoteTransfer('GUEST', 50, 'DE', 'EUR'),
                false,
            ],
            'not eligible - currency mismatch' => [
                $this->createDiscountTransfer('DISCOUNT_CODE', true, 'DE', 'USD'),
                $this->createQuoteTransfer('GUEST', 50, 'DE', 'EUR'),
                false,
            ],
            'not eligible - insufficient subtotal' => [
                $this->createDiscountTransfer('DISCOUNT_CODE', true, 'DE', 'EUR'),
                $this->createQuoteTransfer('GUEST', 10, 'DE', 'EUR'),
                false,
            ],
            'eligible - quote currency is null' => [
                $this->createDiscountTransfer('DISCOUNT_CODE', true, 'DE', 'EUR'),
                $this->createQuoteTransfer('GUEST', 50, 'DE', null),
                true,
            ],
            'not eligible - quote subtotal is zero' => [
                $this->createDiscountTransfer('DISCOUNT_CODE', true, 'DE', 'EUR'),
                $this->createQuoteTransfer('GUEST', 0, 'DE', 'EUR'),
                false,
            ],
            'eligible - minimum conditions' => [
                $this->createDiscountTransfer('MIN_CODE', true, 'DE', 'EUR'),
                $this->createQuoteTransfer('GUEST', 25, 'DE', 'EUR'),
                true,
            ],
            'exception - missing store in QuoteTransfer' => [
                $this->createDiscountTransfer('DISCOUNT_CODE', true, 'DE', 'EUR'),
                $this->createQuoteTransfer('GUEST', 50, null, 'EUR'),
                false,
                MultipleExceptionInterface::class,
            ],
        ];
    }

    private function createDiscountTransfer(string $discountCode, bool $isActive, ?string $storeCode, ?string $currencyCode): DiscountTransfer
    {
        $storeTransfer = new StoreTransfer();
        $storeTransfer->setName($storeCode);

        $currencyTransfer = new CurrencyTransfer();
        $currencyTransfer->setCode($currencyCode);

        return (new DiscountTransfer())
            ->setDiscountCode($discountCode)
            ->setIsActive($isActive)
            ->setStore($storeTransfer)
            ->setCurrency($currencyTransfer);
    }

    private function createQuoteTransfer(string $customerReference, int $subtotal, ?string $storeName, ?string $currencyCode): QuoteTransfer
    {
        $storeTransfer = $storeName ? (new StoreTransfer())->setName($storeName) : null;
        $currencyTransfer = $currencyCode ? (new CurrencyTransfer())->setCode($currencyCode) : null;

        return (new QuoteTransfer())
            ->setCustomerReference($customerReference)
            ->setSubtotal($subtotal)
            ->setStore($storeTransfer)
            ->setCurrency($currencyTransfer);
    }
}
```

## Author

@geronica90
