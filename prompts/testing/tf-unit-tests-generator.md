---
title: Spryker Terraform Unit Tests Generator for Infra Modules

description: A prompt for creating native Terraform unit tests for a specific infra module. It uses 1.6 version of Terraform syntax at the moment.

when_to_use: When you need to create a set of unit tests for a newly created or existing TF module in the TF modules repository. The prompt should be used from the inside of this repository as it needs to read source files to create tests.

tags: [tests, unit-test, tf-modules, automation]

author: @OKrivtsova
---

# Spryker Terraform Unit Tests Generator for Infra Modules

1. Read the source code for the TF module in '{MODULE_FOLDER}' folder and relevant TG template in '{TEMPLATE_FOLDER}' folder.
2. Provide the list of what needs to be tested for this module using unit tests. Then create terraform unit tests for this module using the native feature of terraform available using TF version 1.6. File name for test should be `unit.tftest.hcl`
3. Examine '{MODULE_FOLDER}'/variables.tf file and list all variables declarations, then add missing variables into the test file. The test file must include values for ALL variables that are present in the '{MODULE_FOLDER}'/variables.tf file of the module.
4. Additional requirements for test creation:
   - Do not add any module dependencies to unit tests.
   - Where possible, enable features in the variables in the test file (set to true), even if the default is disabled (set to false) and test these features.
   - In assertions use the specific resource name instead of 'this', because a module can create several resources.
   - If you are not sure if you used correct resource name, indicate it in your answer and ask for the developer to provide it.
   - All test files should be placed in the root of tests folder inside the module. Add instructions on how to run and setup tests.

## Example Usage

1. Read the source code for the TF module in 'efs' folder and relevant TG template in 'template/10-network/efs' folder.
2. Provide the list of what needs to be tested for this module using unit tests. Then create terraform unit tests for this module using the native feature of terraform available using TF version 1.6. File name for test should be `unit.tftest.hcl`
3. Examine 'efs'/variables.tf file and list all variables declarations, then add missing variables into the test file. The test file must include values for ALL variables that are present in the 'efs'/variables.tf file of the module.
4. Additional requirements for test creation:
   - Do not add any module dependencies to unit tests.
   - Where possible, enable features in the variables in the test file (set to true), even if the default is disabled (set to false) and test these features.
   - In assertions use the specific resource name instead of 'this', because a module can create several resources.
   - If you are not sure if you used correct resource name, indicate it in your answer and ask for the developer to provide it.
   - All test files should be placed in the root of tests folder inside the module. Add instructions on how to run and setup tests.

## Example Output

1. What Needs to be Tested (Unit Test Requirements)
   lists the following:
      - what is tested
      - what resource names should be double-checked manually
      - what variables were used in the test


2. Unit Test File
(creates a single file with all tests that can be put here)
```
efs/
├── tests/
   └── unit.tftest.hcl (file contents is provided)
```
3. How to Run and Setup Tests
 (explains how to do this)

Example of the test file
```
provider "aws" {
  region                    = "eu-west-1"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

variables {
  project_name                             = "test-project"
  private_subnet_ids                       = ["subnet-12345678", "subnet-87654321"]
  sftp_enable                              = true  # Enabled for testing SFTP features
  efs_sg                                   = "sg-87654321"
  efs_infrequent_access_transition_policy  = "AFTER_30_DAYS"
  rabbitmq_throughput_mode                 = "bursting"
  rabbitmq_provisioned_throughput_in_mibps  = 100
}

run "verify_rabbitmq_filesystem" {
  command = plan

  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.encrypted == false
    error_message = "RabbitMQ EFS must be encrypted"
  }

  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.lifecycle_policy[0].transition_to_ia == var.efs_infrequent_access_transition_policy
    error_message = "RabbitMQ EFS lifecycle policy does not match input"
  }

  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.tags["Name"] == "${var.project_name}-rabbitmq"
    error_message = "RabbitMQ EFS Name tag is not as expected"
  }
}

run "verify_sftp_filesystem" {
  command = plan

  assert {
    condition     = aws_efs_file_system.sftp_fs[0].creation_token == "${var.project_name}-efs-sftp"
    error_message = "SFTP creation token mismatch"
  }

  assert {
    condition     = aws_efs_file_system.sftp_fs[0].encrypted == false
    error_message = "SFTP EFS encryption should be disabled"
  }

  assert {
    condition     = aws_efs_file_system.sftp_fs[0].performance_mode == "generalPurpose"
    error_message = "SFTP performance mode should be generalPurpose"
  }

  assert {
    condition     = aws_efs_file_system.sftp_fs[0].tags["App"] == "sftp"
    error_message = "SFTP EFS App tag not set correctly"
  }
}

run "verify_mount_targets" {
  command = plan

  assert {
    condition     = length(aws_efs_mount_target.rabbitmq_efs_mt[*]) == length(var.private_subnet_ids)
    error_message = "Number of RabbitMQ mount targets does not match number of private subnets"
  }


  assert {
    condition     = length(aws_efs_mount_target.sftp_efs_mt[*]) == length(var.private_subnet_ids)
    error_message = "Number of SFTP mount targets does not match number of private subnets"
  }
}
```
