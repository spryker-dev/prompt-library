# Specific Refactoring Instructions

## Description

A prompt for providing specific, detailed refactoring instructions that help AI understand exactly what changes to make to improve code structure, readability, and maintainability.

## Prompt Description

This prompt emphasizes the importance of being specific and detailed when asking for code refactoring. Instead of vague requests, it provides clear instructions about what should be extracted, how methods should be named, and what the expected outcome should look like.

## Tags (comma-separated)
refactoring, code-quality, maintainability, readability

## When to Use

- When you have complex methods that need to be broken down into smaller, focused functions
- When you want to improve code readability and maintainability through extraction

## Prompt

```text
Refactor this method: improve readability by {READABILITY_IMPROVEMENT}, improve performance by {PERFORMANCE_IMPROVEMENT}, {ADDITIONAL_REQUIREMENTS}.
```

## Example Usage

```text
Refactor this method: improve readability by splitting into smaller methods, where possible, but avoid one-line methods, improve performance by using method from facade to retrieve multiple products at once, get rid of if/else.
```

## Example Output

```php
public function expandItems(CartChangeTransfer $cartChangeTransfer): CartChangeTransfer
{
    $itemTransfers = $cartChangeTransfer->getItems();
    if ($itemTransfers->count() === 0) {
        return $cartChangeTransfer;
    }

    $skuToItemMap = $this->createSkuToItemMap(itemTransfers: $itemTransfers);
    $productSkus = array_keys(array: $skuToItemMap);
    $productConcreteTransfers = $this->getProductConcreteTransfers(productSkus: productSkus: $productSkus);

    $this->setProductAttributesToItems(
        skuToItemMap: skuToItemMap: $skuToItemMap,
        productConcreteTransfers: productConcreteTransfers: $productConcreteTransfers
    );

    return $cartChangeTransfer;
}

/**
 * 1 reference | 0 overrides
 */
protected function createSkuToItemMap(ArrayObject $itemTransfers): array
{
    $skuToItemMap = [];

    foreach ($itemTransfers as $itemTransfer) {
        $skuToItemMap[$itemTransfer->getSku()] = $itemTransfer;
    }

    return $skuToItemMap;
}

/**
 * 1 reference | 0 overrides
 */
protected function getProductConcreteTransfers(array $productSkus): array
{
    $productConcreteTransfers = $this->getFacade()->findProductConcretesBySkus(skus: skus: $productSkus);
    $indexedProductTransfers = [];

    foreach ($productConcreteTransfers as $productConcreteTransfer) {
        $indexedProductTransfers[$productConcreteTransfer->getSku()] = $productConcreteTransfer;
    }

    return $indexedProductTransfers;
}

/**...
 * 1 reference | 0 overrides
 */
protected function setProductAttributesToItems(array $skuToItemMap, array $productConcreteTransfers): void
{
    foreach ($productConcreteTransfers as $sku => $productConcreteTransfer) {
        if (!isset($skuToItemMap[$sku])) {
            continue;
        }

        $skuToItemMap[$sku]->setAttributes(attributes: attributes: $productConcreteTransfer->getAttributes());
    }
}

### LLM
Claude 3.7 Sonnet

### AI Assistant
Windsurf

### Author
@geronica90
