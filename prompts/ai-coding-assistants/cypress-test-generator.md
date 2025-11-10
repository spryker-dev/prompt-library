---
title: Cypress Test Generator

description: A prompt for generating Cypress tests for provided functionality. This prompt helps developers cover functionality with Cypress tests. It focuses on understanding the context of the functionality.

when_to_use: When you need to cover functionality with Cypress tests.

tags: ['test', 'cypress']

author: @kraal-spryker
---

# Generate Cypress Test

Please cover functionality {FUNCTIONALITY_DESCRIPTION} with Cypress tests. The starting point - {CONTROLLER_ACTION}. Test cases:
{TEST_CASES}

## Example Usage

Please cover functionality of attaching file to different entities with Cypress tests. The starting point - AttachFileController::indexAction(). Test cases:
- Attach file to companies manually.
- Attach file to companies by import file.
- Attach file to company business units manually.
- Attach file to company business units by import file.

## Example Output

```ts
import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SspFileManagementDynamicFixtures, SspFileManagementStaticFixtures } from '@interfaces/backoffice';
import {
  SspFileManagementListPage,
  SspFileManagementAddPage,
  SspFileManagementViewPage,
  SspFileManagementDeletePage,
  SspFileManagementDetachPage,
  SspFileManagementAttachPage,
} from '@pages/backoffice';

describeForSsp('File Manager Module - Files List', { tags: ['@backoffice', '@fileManager', '@ssp'] }, () => {
  const userLoginScenario = container.get(UserLoginScenario);
  const fileManagerAttachmentListPage = container.get(SspFileManagementListPage);
  const fileManagerAttachmentAddPage = container.get(SspFileManagementAddPage);

  let dynamicFixtures: SspFileManagementDynamicFixtures;
  let staticFixtures: SspFileManagementStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach(() => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should successfully attach file to a company manually', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAttachmentScope('company');
    fileManagerAttachmentAttachPage.selectAvailableItems('company', [dynamicFixtures.company1.name]);
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully attach file to a business unit manually', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAttachmentScope('business-unit');
    fileManagerAttachmentAttachPage.selectAvailableItems('business-unit', [dynamicFixtures.businessUnit.name]);
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully attach business units via CSV import', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAttachmentScope('business-unit');

    fileManagerAttachmentAttachPage.uploadCsvFile('business-unit', 'csv/business-units-example.csv');
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully attach companies via CSV import', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAttachmentScope('company');

    fileManagerAttachmentAttachPage.uploadCsvFile('company', 'csv/companies-example.csv');
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });
});

function describeForSsp(title: string, options: { tags: string[] }, fn: () => void): void {
  (['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, options, fn);
}
```
