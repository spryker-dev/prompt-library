# Project Cypress Test Generator

## Description

A prompt for generating Cypress tests in Spryker Projects for provided functionality.

## Prompt Description

This prompt helps developers cover project functionality with Cypress tests. It focuses on understanding the context of the functionality.

## Tags (comma-separated)
test, cypress

## When to Use

When you need to cover functionality with Cypress tests for your project.

## Prompt

```text
Please cover functionality {FUNCTIONALITY_DESCRIPTION} with Cypress tests. Test cases that you should cover:
{TEST_CASES}. Do not write any tests that are not requested.
```

## Example Usage With Plain Text

```text
Please cover functionality of attaching file to different entities with Cypress tests. The starting point - AttachFileController::indexAction(). Test cases:
- Attach file to companies manually.
- Attach file to companies by import file.
- Attach file to company business units manually.
- Attach file to company business units by import file.
- Attach file to company users manually.
```

## Example Usage With Files

```text
Please cover functionality Convert_Shopping_List_to_Cart_User_Story.txt with Cypress tests. Test cases that you should cover: List_of_Testcases.txt
```

## Example Output
For a sample user story:
```As a Company User (B2B buyer)
 I want to create, manage, share, and convert Shopping Lists into carts
 so that I can plan and execute repeat, team-based purchases efficiently.```

And the test cases list that requests 2 tests top be created: 
* Verify that an authenticated Company User can navigate to “My Account” → “Shopping Lists” and see the list page
* Successfully add a concrete product from PDP to a chosen shopping list

The following files will be created:
```
cypress/support/scenarios/storefront/storefront-shopping-lists-scenarios.ts
cypress/support/page-objects/storefront/shopping-lists/storefront-shopping-lists-page.ts
cypress/support/cy-commands/storefront/shopping-lists-commands.ts
cypress/fixtures/shopping-list-data.json
cypress/e2e/storefront/shopping-lists/storefront-shopping-list-specific-tests.cy.ts
```
The following files will be updated with shopping-list related locators and methods(if they are not yet ther):
```
cypress/support/page-objects/storefront/product/storefront-product-details-page.ts
```

Here is an example of the test specification file:

```ts
import shoppingListData from '../../../fixtures/shopping-list-data.json'
import { StorefrontShoppingListsScenarios } from '../../../support/scenarios/storefront/storefront-shopping-lists-scenarios'
import { StorefrontShoppingListsPage } from '../../../support/page-objects/storefront/shopping-lists/storefront-shopping-lists-page'
import { StorefrontProductDetailsPage } from '../../../support/page-objects/storefront/product/storefront-product-details-page'

// Specific test cases from Cypress Tests.md document

const scenarios = new StorefrontShoppingListsScenarios()
const shoppingListsPage = new StorefrontShoppingListsPage()
const productDetailsPage = new StorefrontProductDetailsPage()

describe('Shopping Lists - Specific Test Cases', () => {
  beforeEach(() => {
    cy.loginAsCompanyUser()
  })

  describe('My Account – Shopping Lists (List Page)', () => {
    it('should verify that an authenticated Company User can navigate to "My Account" → "Shopping Lists" and see the list page', () => {
      // Navigate to My Account
      cy.visit('/en/customer/overview')

      // Click on Shopping Lists menu item
      shoppingListsPage.getMyAccountMenuShoppingLists().click()

      // Verify navigation to Shopping Lists page
      cy.url().should('include', '/customer/shopping-lists')

      // Expected Outcome: "Shopping Lists" page loads with list table and action controls visible
      shoppingListsPage.getShoppingListsTable().should('be.visible')
      shoppingListsPage.getCreateListButton().should('be.visible')

      // Verify page title
      shoppingListsPage.getPageTitle().should('contain.text', 'Shopping Lists')

      // Verify table headers are present
      shoppingListsPage.getShoppingListsTableHeader().should('be.visible')
      shoppingListsPage.getShoppingListsTableHeader().should('contain.text', 'Name')
      shoppingListsPage.getShoppingListsTableHeader().should('contain.text', 'Owner')
      shoppingListsPage.getShoppingListsTableHeader().should('contain.text', 'Created')
      shoppingListsPage.getShoppingListsTableHeader().should('contain.text', 'Access Level')
      shoppingListsPage.getShoppingListsTableHeader().should('contain.text', 'Items')
    })
  })

  describe('Product Detail Page (PDP) – Add to Shopping List', () => {
    beforeEach(() => {
      // Create a shopping list for testing
      const { name } = shoppingListData.shoppingLists.validList
      scenarios.createShoppingList(name)
    })

    it('should successfully add a concrete product from PDP to a chosen shopping list', () => {
      const { sku, name: productName, price, availability } = shoppingListData.productData.concreteProduct
      const { quantity, note } = shoppingListData.shoppingListItems.validItem
      const { name: listName } = shoppingListData.shoppingLists.validList

      // Navigate to PDP
      cy.visit(`/en/product/${sku}`)

      // Verify product information is displayed
      productDetailsPage.getProductName().should('contain.text', productName)
      productDetailsPage.getProductPrice().should('contain.text', price)

      // Add to shopping list
      productDetailsPage.addToList(listName, quantity, note)

      // Expected Outcome: Item with correct SKU and quantity is added to the target list
      productDetailsPage.getSuccessMessage().should('contain.text', 
        shoppingListData.validationMessages.successAddToList
      )

      // Verify item was added to the list
      cy.visit('/en/customer/shopping-lists')
      shoppingListsPage.viewShoppingList(0)

      // Check that the item appears in the shopping list
      shoppingListsPage.getShoppingListItemsTable()
        .should('contain.text', productName)
        .should('contain.text', quantity.toString())
        .should('contain.text', note)
    })
  })
})

```


### LLM
Claude 4 Sonnet

### AI Assistant
Cursor

### Author
@olena.krivtsova