# Spryker Data Import Generator

## Description

A prompt for creating comprehensive Spryker data import modules including database schema, transfer objects, import configuration, and implementation logic for new entities.

## Prompt Description

This prompt helps developers create complete data import functionality for new entities in Spryker applications. It covers database schema creation, transfer object generation, import configuration, and the implementation of import logic with CSV parsing and validation.

### Tags (comma-separated)
data-import, csv, generator, automation

## When to Use

When you need to create a complete data import system for a new entity in Spryker with database schema, transfers, and import logic

## Prompt

```text
I need to create a data import for my new entity '{ENTITY_NAME}'. Main AC: Create a new Spryker module named {MODULE_NAME}. Create a new module {MODULE_NAME} in Zed Layer: 1. Create the database schema: - Table: {TABLE_NAME} - Columns: {COLUMN_DEFINITIONS}. Include timestampable behavior. 2. Generate all necessary Transfer objects. Create a new module {MODULE_NAME}DataImport in Zed Layer: 1. Create a data import configuration for this table: - Import type: {IMPORT_TYPE} - Source: CSV file - Fields: {FIELD_LIST}. 2. Generate all necessary Transfer objects. 3. Implement the data import logic in Zed: - Add a facade with a method "import{ENTITY_NAME}Data({TRANSFER_NAME} $transfer): DataImporterReportTransfer" - Delegate the import logic to a model class "{ENTITY_NAME}Writer" - Implement "{ENTITY_NAME}Writer" with CSV parsing, validation, and saving to DB using the entity. 4. Add the configuration to the "data_import.yml and register the plugin. Use Spryker best practices. Avoid bridges and extra phpDocs. Use current branch. Do not run propel:install or transfer:generate, write only code.
```

## Example Usage

```text
I need to create a data import for my new entity 'picker'. Main AC: Create a new Spryker module named Picker. Create a new module Picker in Zed Layer: 1. Create the database schema: - Table: pyz_picker - Columns: - id_picker (PK, auto-increment integer) - first_name (VARCHAR 255, required) - last_name (VARCHAR 255, required) - middle_name (VARCHAR 255, optional) - rating (INTEGER, optional) - date_of_birth (DATE, optional). Include timestampable behavior. 2. Generate all necessary Transfer objects. Create a new module PickerDataImport in Zed Layer: 1. Create a data import configuration for this table: - Import type: picker - Source: CSV file - Fields: first_name, last_name, middle_name, rating, date_of_birth. 2. Generate all necessary Transfer objects. 3. Implement the data import logic in Zed: - Add a facade with a method "importPickerData(PickerImportTransfer $transfer): DataImporterReportTransfer" - Delegate the import logic to a model class "PickerWriter" - Implement "PickerWriter" with CSV parsing, validation, and saving to DB using the entity. 4. Add the configuration to the "data_import.yml and register the plugin. Use Spryker best practices. Avoid bridges and extra phpDocs. Use current branch. Do not run propel:install or transfer:generate, write only code.
```

## Example Output

```
PickerDataImport/
├── Business/
│   ├── Writer/
│   │   └── PickerWriterStep.php
│   ├── PickerDataImportBusinessFactory.php
│   └── PickerDataImportFacade.php
└── Communication/
    ├── PickerDataImportConfig.php
    └── PickerDataImportDependencyProvider.php
```

### LLM
Claude 3.7 Sonnet

### AI Assistant
Windsurf

### Author
@shveider
