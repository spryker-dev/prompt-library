---
title: Spryker Terraform Integration Tests Generator for Infra Modules

description: A prompt for creating native Terraform integration tests for a specific infra module. It uses 1.6 version of Terraform syntax at the moment.

when_to_use: When you need to create a set of integration tests for a newly created or existing TF module in the TF modules repository. The prompt should be used from the inside of this repository as it needs to read source files to create tests.

tags: [tests, integration-test, tf-modules, automation]

author: @OKrivtsova
---

# Spryker Terraform Integration Tests Generator for Infra Modules

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
   - For each module you test, validate which outputs the module creates and only test for those
   - When using paths anywhere, use relative paths from the root directory of the git repository, don't use absolute paths
   - No readme files should be created for tests, any documentation should be inside the tests as comments. Add comments only for non-trivial things.

## Example Usage

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
   - For each module you test, validate which outputs the module creates and only test for those
   - When using paths anywhere, use relative paths from the root directory of the git repository, don't use absolute paths
   - No readme files should be created for tests, any documentation should be inside the tests as comments. Add comments only for non-trivial things.

## Example Output

1. What Needs to be Tested (Unit Test Requirements)
   lists the following:
      - what is tested
      - what resource names should be double-checked manually
      - what variables were used in the test


2. Test Files
(creates a single file with all tests that can be put here)
```
efs/
├── tests/
   ├── integration.tftest.hcl (file contents is provided)
   └── setup/
      └──main.tf
```


3. How to Run and Setup Tests
 (explains how to do this)


Example `main.tf` output
```
resource "aws_vpc" "test_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "test-vpc"
  }
}

data "aws_availability_zones" "available" {}

resource "aws_subnet" "private" {
  count                   = 2
  vpc_id                  = aws_vpc.test_vpc.id
  cidr_block              = cidrsubnet(aws_vpc.test_vpc.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = false
  tags = {
    Name = "test-private-subnet-${count.index}"
  }
}

resource "aws_security_group" "test_sg" {
  name        = "test-efs-sg"
  description = "Security group for EFS integration tests"
  vpc_id      = aws_vpc.test_vpc.id

  ingress {
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "test-efs-sg"
  }
}

output "vpc_id" {
  value = aws_vpc.test_vpc.id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "efs_sg" {
  value = aws_security_group.test_sg.id
}
```
Example test file output
```
provider "aws" {
  region                      = "eu-west-1"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

variables {
  project_name                                = "test-project-efs"
  sftp_enable                                 = true
  efs_infrequent_access_transition_policy     = "AFTER_30_DAYS"
  rabbitmq_throughput_mode                    = "provisioned"
  rabbitmq_provisioned_throughput_in_mibps    = 100
}

run "setup_tests" {
  module {
    source = "./tests/setup"
  }
}

run "verify_efs_integration" {
  variables {
    project_name                                = var.project_name
    sftp_enable                                 = var.sftp_enable
    efs_infrequent_access_transition_policy     = var.efs_infrequent_access_transition_policy
    rabbitmq_throughput_mode                    = var.rabbitmq_throughput_mode
    rabbitmq_provisioned_throughput_in_mibps    = var.rabbitmq_provisioned_throughput_in_mibps
    private_subnet_ids                          = run.setup_tests.private_subnet_ids
    efs_sg                                      = run.setup_tests.efs_sg
  }

  command = apply

  # RabbitMQ EFS File System Assertions
  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.encrypted == false
    error_message = "RabbitMQ EFS must be unencrypted."
  }

  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.performance_mode == "generalPurpose"
    error_message = "RabbitMQ EFS performance mode must be 'generalPurpose'."
  }

  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.throughput_mode == var.rabbitmq_throughput_mode
    error_message = "RabbitMQ EFS throughput mode must match variable value."
  }

  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.provisioned_throughput_in_mibps == var.rabbitmq_provisioned_throughput_in_mibps
    error_message = "RabbitMQ EFS provisioned throughput must match variable value."
  }

  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.lifecycle_policy[0].transition_to_ia == var.efs_infrequent_access_transition_policy
    error_message = "RabbitMQ EFS lifecycle policy must match variable value."
  }

  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.tags["Name"] == "${var.project_name}-rabbitmq"
    error_message = "RabbitMQ EFS Name tag must be set correctly."
  }

  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.tags["App"] == "rabbitmq"
    error_message = "RabbitMQ EFS App tag must be set correctly."
  }

  # SFTP EFS File System Assertions (when enabled)
  assert {
    condition     = length(aws_efs_file_system.sftp_fs) == 1
    error_message = "SFTP EFS must be created when sftp_enable is true."
  }

  assert {
    condition     = aws_efs_file_system.sftp_fs[0].encrypted == false
    error_message = "SFTP EFS must be unencrypted."
  }

  assert {
    condition     = aws_efs_file_system.sftp_fs[0].performance_mode == "generalPurpose"
    error_message = "SFTP EFS performance mode must be 'generalPurpose'."
  }

  assert {
    condition     = aws_efs_file_system.sftp_fs[0].lifecycle_policy[0].transition_to_ia == var.efs_infrequent_access_transition_policy
    error_message = "SFTP EFS lifecycle policy must match variable value."
  }

  assert {
    condition     = aws_efs_file_system.sftp_fs[0].tags["Name"] == "${var.project_name}-sftp"
    error_message = "SFTP EFS Name tag must be set correctly."
  }

  assert {
    condition     = aws_efs_file_system.sftp_fs[0].tags["App"] == "sftp"
    error_message = "SFTP EFS App tag must be set correctly."
  }

  # Mount Target Assertions
  assert {
    condition     = length(aws_efs_mount_target.rabbitmq_efs_mt) == length(var.private_subnet_ids)
    error_message = "Number of RabbitMQ mount targets must match private subnet count."
  }

  assert {
    condition     = length(aws_efs_mount_target.sftp_efs_mt[*]) == length(var.private_subnet_ids)
    error_message = "Number of SFTP mount targets must match private subnet count."
  }


}

run "verify_efs_disabled_sftp" {
  variables {
    project_name                                = var.project_name
    sftp_enable                                 = false
    efs_infrequent_access_transition_policy     = var.efs_infrequent_access_transition_policy
    rabbitmq_throughput_mode                    = "bursting"
    rabbitmq_provisioned_throughput_in_mibps    = null
    private_subnet_ids                          = run.setup_tests.private_subnet_ids
    efs_sg                                      = run.setup_tests.efs_sg
  }

  command = apply

  # Verify SFTP is not created when disabled
  assert {
    condition     = length(aws_efs_file_system.sftp_fs) == 0
    error_message = "SFTP EFS must not be created when sftp_enable is false."
  }

  # Verify RabbitMQ still works with bursting mode
  assert {
    condition     = aws_efs_file_system.rabbitmq_fs.throughput_mode == "bursting"
    error_message = "RabbitMQ EFS throughput mode must be 'bursting'."
  }

  assert {
    #set to 0
    condition     = aws_efs_file_system.rabbitmq_fs.provisioned_throughput_in_mibps == 0
    error_message = "RabbitMQ EFS provisioned throughput must be null for bursting mode."
  }
}

```
