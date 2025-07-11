# Plugin Introduction with Context

## Description

A prompt that provides comprehensive context about system architecture, business requirements, and technical constraints to help AI generate well-integrated plugin implementations.

## Prompt Description

This prompt demonstrates the importance of providing rich context when asking AI to create plugins or extensions. It includes details about the existing system, business logic, integration points, and specific technical requirements to ensure the generated code fits seamlessly into the existing architecture.

### Tags (comma-separated)
plugin, integration, context, architecture

## When to Use

- When you need to create a plugin that integrates with existing Spryker modules.

## Prompt

```text
Please, introduce a plugin to {FUNCTIONALITY_DESCRIPTION}. Our goal is to {SPECIFIC_GOAL}. {TECHNICAL_DETAILS}. The {CONFIGURATION_REQUIREMENT}. The {FACADE_METHOD_REQUIREMENT}.
```

## Example Usage

```text
Please, introduce a plugin to filter shipment methods based on item quantity. Our goal is to filter out cheaper shipment methods when the quantity is more than 10 items for the shipment group. Shipment price taken from storeCurrencyPrice property of the ShipmentGroup transfer. The amount of items must be provided via config. The minimum shipment price will be provided via a separate facade method may vary depending on store or currency.
```

## Example Output

```php
<?php

namespace Pyz\Zed\Shipment\Business\Filter;

use Generated\Shared\Transfer\QuoteTransfer;
use Generated\Shared\Transfer\ShipmentMethodTransfer;

class ShipmentMethodFilter
{
    /**
     * @param array<\Generated\Shared\Transfer\ShipmentMethodTransfer> $shipmentMethodTransfers
     * @param \Generated\Shared\Transfer\QuoteTransfer $quoteTransfer
     *
     * @return array<\Generated\Shared\Transfer\ShipmentMethodTransfer>
     */
    public function filterShipmentMethods(array $shipmentMethodTransfers, QuoteTransfer $quoteTransfer): array
    {
        $filteredShipmentMethods = [];

        foreach ($shipmentMethodTransfers as $shipmentMethodTransfer) {
            if (!$this->isShipmentMethodAvailable($shipmentMethodTransfer)) {
                continue;
            }

            if (!$this->isShipmentMethodApplicable($shipmentMethodTransfer, $quoteTransfer)) {
                continue;
            }

            $filteredShipmentMethods[] = $shipmentMethodTransfer;
        }

        return $filteredShipmentMethods;
    }

    /**
     * @param \Generated\Shared\Transfer\ShipmentMethodTransfer $shipmentMethodTransfer
     *
     * @return bool
     */
    private function isShipmentMethodAvailable(ShipmentMethodTransfer $shipmentMethodTransfer): bool
    {
        return $shipmentMethodTransfer->getIsActive();
    }

    /**
     * @param \Generated\Shared\Transfer\ShipmentMethodTransfer $shipmentMethodTransfer
     * @param \Generated\Shared\Transfer\QuoteTransfer $quoteTransfer
     *
     * @return bool
     */
    private function isShipmentMethodApplicable(ShipmentMethodTransfer $shipmentMethodTransfer, QuoteTransfer $quoteTransfer): bool
    {
        $storeTransfer = $quoteTransfer->getStore();

        if ($storeTransfer === null) {
            return false;
        }

        $shipmentMethodStoreRelation = $shipmentMethodTransfer->getStoreRelation();

        if ($shipmentMethodStoreRelation === null) {
            return false;
        }

        foreach ($shipmentMethodStoreRelation->getStores() as $shipmentMethodStoreTransfer) {
            if ($shipmentMethodStoreTransfer->getIdStore() === $storeTransfer->getIdStore()) {
                return true;
            }
        }

        return false;
    }
}

### LLM
Claude 3.7 Sonnet

### AI Assistant
Windsurf

### Author
@geronica90
