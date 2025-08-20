# Spryker Data Import Generator

## Description

A prompt for creating comprehensive Spryker data importer functionality inside the SprykerFeature.SelfServicePortal module including database schema, transfer objects, import configuration, and implementation logic for new entities.

## Prompt Description

This prompt helps developers create complete data import functionality for new and existing entities in Spryker applications. It covers database schema creation, transfer object generation, import configuration, and the implementation of import logic with CSV parsing and validation.

## Tags (comma-separated)
data-import, csv, generator, automation, ssp

## When to Use

When you need to create a complete data import system for a new or existing entity in Spryker with database schema, transfers, and import logic

## Prompt

```text
Please create data importer for the {ENTITY} inside the module {MODULE_NAME}. use data importer for {EXAMPLE_ENTITY} as an example 

```

## Example Usage

```text
pls create data importer for the ssp assets inside the module SelfServicePortal. use data importer for inquiries as an example
```

## Example Output

```
SelfServicePortal/
├── Business/
    ├───Asset
    │   ├── Writer/
    │   │   └── AssetWriterStep.php
│   ├── PickerDataImportBusinessFactory.php
└── Communication/
    ├── PickerDataImportConfig.php
```

### LLM
Claude 4.0 Sonnet
Gemini 2.5 Pro
GPT 5.0

### AI Assistant
Cursor

### Author
@kraal-spryker
