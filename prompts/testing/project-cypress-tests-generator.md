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



### LLM
Claude 4 Sonnet

### AI Assistant
Cursor

### Author
@olena.krivtsova