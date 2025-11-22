---
title: Symfony Form Generator

description: A prompt for creating Symfony forms based on transfer object properties, including appropriate field types, constants, and data providers for complex form handling.

when_to_use: When you need to create a new Symfony form based on a transfer object with proper field mapping and type handling

tags: [symfony, form, generator, validation]

author: @geronica90
---

# Symfony Form Generator

please introduce new Symfony form in {MODULE_NAME} module based on {TRANSFER_NAME}.
please, consider that some fields depending on their type and names may have different input types, like radio, multiselect or select.
Use transfer property names as a filed names.

## Example Usage

please introduce new Symfony form in ProductManagement module based on ProductTemplateTransfer.
please, consider that some fields depending on their type and names may have different input types, like radio, multiselect or select.
Use transfer property names as a filed names.

## Example Output

```php
<?php

namespace Pyz\Zed\ProductManagement\Communication\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class ProductTemplateForm extends AbstractType
{
    protected const FIELD_NAME = 'name';
    protected const FIELD_DESCRIPTION = 'description';
    protected const FIELD_IS_ACTIVE = 'isActive';
    protected const FIELD_IS_ARCHIVED = 'isArchived';
    protected const FIELD_TAGS = 'tags';
    protected const FIELD_CATEGORIES = 'categories';
    protected const FIELD_RATING = 'rating';
    protected const FIELD_STATUS = 'status';
    protected const FIELD_THEME = 'theme';
    protected const FIELD_LAYOUT = 'layout';
    protected const FIELD_PRIORITY_LEVEL = 'priorityLevel';
    protected const FIELD_APPROVAL_STATUS = 'approvalStatus';

    protected const STATUS_DRAFT = 'draft';
    protected const STATUS_PENDING = 'pending';
    protected const STATUS_APPROVED = 'approved';
    protected const STATUS_REJECTED = 'rejected';

    /**
     * @param \Symfony\Component\Form\FormBuilderInterface $builder
     * @param array<string, mixed> $options
     *
     * @return void
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $this
            ->addNameField(builder: $builder)
            ->addDescriptionField(builder: $builder)
            ->addIsActiveField(builder: $builder)
            ->addIsArchivedField(builder: $builder)
            ->addTagsField(builder: $builder)
            ->addCategoriesField(builder: $builder)
            ->addRatingField(builder: $builder)
            ->addStatusField(builder: $builder)
            ->addThemeField(builder: $builder)
            ->addLayoutField(builder: $builder)
            ->addPriorityLevelField(builder: $builder)
            ->addApprovalStatusField(builder: $builder);
    }
}
```
