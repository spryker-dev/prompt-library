---
title: Project Cypress Test Generator

description: A prompt for generating Cypress tests in Spryker Projects for provided functionality.

when_to_use: When you need to cover functionality with Cypress tests for your project

tags: [test, cypress]

author: @olena.krivtsova
---

# Project Cypress Test Generator

Please cover functionality {FUNCTIONALITY_DESCRIPTION} with Cypress tests. Test cases that you should cover:
{TEST_CASES}. Do not write any tests that are not requested.

## Example Usage With Plain Text

Please cover functionality of adding customer address on Storefront with Cypress tests. Test cases that you should cover:
- Creating new customer address in Storefront
- Viewing created address
Do not write any tests that are not requested.

## Example Usage With Files

Please cover functionality Convert_Shopping_List_to_Cart_User_Story.txt with Cypress tests. Test cases that you should cover: List_of_Testcases.txt. Do not write any tests that are not requested.

## Example Output

For a sample user story:
```text
As a Company User (B2B buyer)
 I want to create, manage, share, and convert Shopping Lists into carts
 so that I can plan and execute repeat, team-based purchases efficiently.
```

And the test cases list that requests 2 tests top be created:
* Verify that an authenticated Company User can navigate to "My Account" → "Shopping Lists" and see the list page
* Successfully add a concrete product from PDP to a chosen shopping list

The following files will be created:
```text
cypress/support/scenarios/storefront/storefront-shopping-lists-scenarios.ts
cypress/support/page-objects/storefront/shopping-lists/storefront-shopping-lists-page.ts
cypress/support/cy-commands/storefront/shopping-lists-commands.ts
cypress/fixtures/shopping-list-data.json
cypress/e2e/storefront/shopping-lists/storefront-shopping-list-specific-tests.cy.ts
```
The following files will be updated with shopping-list related locators and methods(if they are not yet there):
```text
cypress/support/page-objects/storefront/product/storefront-product-details-page.ts
```

Here is an example of the test specification file:

```ts
import shoppingListData from '../../../fixtures/shopping-list-data.json'
import userCredentials from '../../../fixtures/user-data.json'
import { StorefrontShoppingListsScenarios } from '../../../support/scenarios/storefront/storefront-shopping-lists-scenarios'
import { StorefrontShoppingListsPage } from '../../../support/page-objects/storefront/shopping-lists/storefront-shopping-lists-page'
import { StorefrontProductDetailsPage } from '../../../support/page-objects/storefront/product/storefront-product-details-page'
import { StorefrontLoginPage } from '../../../support/page-objects/storefront/login/storefront-login-page'
import { StorefrontCustomerOverviewPage } from '../../../support/page-objects/storefront/customer/storefront-customer-overview-page'

// Specific test cases from Cypress Tests.md document

const scenarios = new StorefrontShoppingListsScenarios()
const shoppingListsPage = new StorefrontShoppingListsPage()
const productDetailsPage = new StorefrontProductDetailsPage()
const loginPage = new StorefrontLoginPage()
const customerOverviewPage = new StorefrontCustomerOverviewPage()

describe('Shopping Lists - Specific Test Cases', () => {
  beforeEach(() => {
    loginPage.login(userCredentials.backofficeUser.email, userCredentials.backofficeUser.password)
  })

  describe('My Account – Shopping Lists (List Page)', () => {
    it('should verify that an authenticated Company User can navigate to "My Account" → "Shopping Lists" and see the list page', () => {
      // Navigate to My Account
      customerOverviewPage.visit()

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
      productDetailsPage.visitProduct(sku)

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
      shoppingListsPage.visit()
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
