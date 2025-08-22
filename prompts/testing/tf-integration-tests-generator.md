# Spryker Terraform Integration Tests Generator for Infra Modules

## Description

A prompt for creating native Terraform integration tests for a specific infra module. It uses 1.6 version of Terraform syntax at the moment.

## Prompt Description

This prompt helps to create a set of unit integration for a TF module. An integration test is a test that runs apply, so it actually creates the resource at the start of the test and tears it down automatically at the end of the test. It also requires that dependency modules are created for the test purpose when they need to reference values from those dependencies (e.g. the name of a security group or vpc).

## Tags (comma-separated)
tests, integration-test, tf-modules, automation

## When to Use

When you need to create a set of integration tests for a newly created or existing TF module in `/spryker/tfcloud-modules` repository. The prompt should be used from the inside of this repository as it needs to read source files to create tests.

## Prompt

```text
1. Read the source code for the TF module in '{MODULE_FOLDER}' folder and relevant TG template in '{TEMPLATE_FOLDER}' folder. 
2. Provide the list of what needs to be tested for this module using Terraform integration tests. Then create terraform integration tests for this module using the native feature of terraform available using TF version 1.6. File name for test should be `integration.tftest.hcl`
3. Examine '{MODULE_FOLDER}/variables.tf' file and list all variables declarations, then add missing variables into the test file. The test file must include values for ALL variables that are present in the '{MODULE_FOLDER}/variables.tf' file of the module. 
4. Examine '{TEMPLATE_FOLDER}' template to figure out what dependencies the module has. Then create the modules needed as dependencies in the tests/setup folder, the created module should be independent and as simple as possible.
5. Additional requirements for test creation:
   - For the module with dependencies, reference the modules created in the setup folder in the first 'run' of the test file like this:
    """run "setup_tests" {
    module {
    source = "./tests/setup"
    }
    }"""
   - When referencing output values from ./tests/setup module, declare such variables at the start of the relevant run block in a nested variables block using `run.setup_tests.output_variable` format
   - Where possible, enable features in the variables in the test file (set to true), even if the default is disabled (set to false) and test these features. 
   - In assertions use the specific resource name instead of 'this', because a module can create several resources. 
   - If you are not sure if you used correct resource name, indicate it in your answer and ask for the developer to provide it. 
   - All test files should be placed in the root of tests folder inside the module. Add instructions on how to run and setup tests.
```

## Example Usage

```text
1. Read the source code for the TF module in 'efs' folder and relevant TG template in 'template/10-network/efs' folder. 
2. Provide the list of what needs to be tested for this module using Terraform integration tests. Then create terraform integration tests for this module using the native feature of terraform available using TF version 1.6. File name for test should be `integration.tftest.hcl`
3. Examine 'efs'/variables.tf file and list all variables declarations, then add missing variables into the test file. The test file must include values for ALL variables that are present in the 'efs'/variables.tf file of the module. 
4. Examine 'template/10-network/efs' template to figure out what dependencies the module has. Then create the modules needed as dependencies in the tests/setup folder, the created module should be independent and as simple as possible.
5. Additional requirements for test creation:
   - For the module with dependencies, reference the modules created in the setup folder in the first 'run' of the test file like this:
    """run "setup_tests" {
    module {
    source = "./tests/setup"
    }
    }"""
   - When referencing output values from ./tests/setup module, declare such variables at the start of the relevant run block in a nested variables block using `run.setup_tests.output_variable` format
   - Where possible, enable features in the variables in the test file (set to true), even if the default is disabled (set to false) and test these features. 
   - In assertions use the specific resource name instead of 'this', because a module can create several resources. 
   - If you are not sure if you used correct resource name, indicate it in your answer and ask for the developer to provide it. 
   - All test files should be placed in the root of tests folder inside the module. Add instructions on how to run and setup tests.
```

## Example Output


```

1. What Needs to be Tested (Unit Test Requirements)
   lists the following:
      - what is tested
      - what resource names should be double-checked manually
      - what variables were used in the test


2. Unit Test File
(creates a single file with all tests that can be put here)

efs/
├── tests/
   └── integration.tftest.hcl (file contents is provided)

3. How to Run and Setup Tests
 (explains how to do this)
```

### LLM
Claude 3.7 Sonnet
o3-mini
GPT-4o

### AI Assistant
VS Code + GitHub Copilot
Cursor

### Author
@OKrivtsova
