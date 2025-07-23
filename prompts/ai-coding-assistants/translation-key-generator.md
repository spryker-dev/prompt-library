# Translation Key Generator

## Description

A prompt for generating translations for specific keys across multiple locales in CSV format, ensuring consistent and contextually appropriate translations.

## Prompt Description

This prompt helps developers add translations for missing keys in translation files. It focuses on understanding the context of the keys and providing accurate translations that maintain consistency with existing translation patterns in the project.

## Tags (comma-separated)
translation, i18n, localization, key-generator

## When to Use

When you need to add translations for new keys across multiple locales

## Prompt

```text
Can you please add translations for those keys for {LOCALE_LIST} locales
```

## Example Usage

```text
Can you please add translations for those keys for de_DE, es_ES and fr_FR locales?
```

## Example Output

```csv
key,translation,locale
general.confirm.button,Confirm,en_US
general.confirm.button,Bestätigen,de_DE
general.confirm.button,Confirmar,es_ES
general.confirm.button,Confirmer,fr_FR
permission.name.ViewCompanySspAssetPermissionPlugin,View company ssp assets,en_US
permission.name.ViewCompanySspAssetPermissionPlugin,Unternehmens-SSP-Assets anzeigen,de_DE
permission.name.ViewCompanySspAssetPermissionPlugin,Ver activos ssp de la empresa,es_ES
permission.name.ViewCompanySspAssetPermissionPlugin,Afficher les actifs ssp de l'entreprise,fr_FR
permission.name.ViewBusinessUnitSspAssetPermissionPlugin,View business unit ssp assets,en_US
permission.name.ViewBusinessUnitSspAssetPermissionPlugin,Geschäftseinheit-SSP-Assets anzeigen,de_DE
permission.name.ViewBusinessUnitSspAssetPermissionPlugin,Ver activos ssp de la unidad de negocio,es_ES
permission.name.ViewBusinessUnitSspAssetPermissionPlugin,Afficher les actifs ssp de l'unité commerciale,fr_FR
permission.name.CreateSspAssetPermissionPlugin,Create ssp assets,en_US
permission.name.CreateSspAssetPermissionPlugin,SSP-Assets erstellen,de_DE
permission.name.CreateSspAssetPermissionPlugin,Crear activos ssp,es_ES
permission.name.CreateSspAssetPermissionPlugin,Créer des actifs ssp,fr_FR
permission.name.UpdateSspAssetPermissionPlugin,Update ssp assets,en_US
permission.name.UpdateSspAssetPermissionPlugin,SSP-Assets aktualisieren,de_DE
permission.name.UpdateSspAssetPermissionPlugin,Actualizar activos ssp,es_ES
permission.name.UpdateSspAssetPermissionPlugin,Mettre à jour les actifs ssp,fr_FR
permission.name.UnassignSspAssetPermissionPlugin,Unassign business unit ssp assets,en_US
permission.name.UnassignSspAssetPermissionPlugin,Geschäftseinheit-SSP-Assets aufheben,de_DE
permission.name.UnassignSspAssetPermissionPlugin,Desasignar activos ssp de la unidad de negocio,es_ES
permission.name.UnassignSspAssetPermissionPlugin,Annuler l'attribution des actifs ssp de l'unité commerciale,fr_FR
```

### LLM
Claude 3.7 Sonnet

### AI Assistant
Windsurf

### Author
@geronica90
