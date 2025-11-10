---
title: Spryker New Module Generator

description: A prompt for creating new Spryker modules with standardized structure and required components, ensuring consistent module creation following Spryker's architectural principles and coding standards.

when_to_use: When creating a new module in the Spryker Zed application, implementing new business functionality that requires database persistence, extending existing Spryker functionality with custom features, or adding new API endpoints or services to your Spryker application.

tags: [spryker, module-creation, zed, persistence-layer, business-logic, transfer-objects, php, propel-orm]

author: @shveider
---

# Spryker New Module Generator

ModuleName: {YourModuleName}
EntityName: ModuleName

Entity fields:
    {fields}

Business logic:
    {business_logic}

Create a new module in zed with the following files:
- src/Zed/[ModuleName]/Business/Folders with business models
- src/Zed/[ModuleName]/Business/[ModuleName]BusinessFactory.php
- src/Zed/[ModuleName]/Business/[ModuleName]Facade.php
- src/Zed/[ModuleName]/Business/[ModuleName]FacadeInterface.php
- src/Zed/[ModuleName]/Persistence/Propel/Schema/spy_[module_name].schema.xml
- src/Zed/[ModuleName]/Persistence/[ModuleName]EntityManager.php
- src/Zed/[ModuleName]/Persistence/[ModuleName]EntityManagerInterface.php
- src/Zed/[ModuleName]/Persistence/[ModuleName]Repository.php
- src/Zed/[ModuleName]/Persistence/[ModuleName]RepositoryInterface.php
- src/Zed/[ModuleName]/Communication/Plugin
- src/Zed/[ModuleName]/[ModuleName]DependencyProvider.php

### Code style conventions
Follow the code style conventions of the Spryker project.

### Persistence Layer
Add crud operations in the `EntityManager` and `Repository` classes.
   Repositories should extend `AbstractRepository` and implement the `RepositoryInterface`.
   The `EntityManager` should implement the `EntityManagerInterface`.
   Repository methods should return transfers, EntityManager methods should expect transfers as parameters.

### Transfer Object
Create a transfer object definition for entity in `src/Shared/[ModuleName]/Transfer/[module_name].transfer.xml`.

## Similar Module Example
Check src/Zed/Sales as an example of a module with a similar structure.

## Example Usage

ModuleName: ProductReview
EntityName: ProductReview

Entity fields:
    - id_product_review (integer, primary key)
    - fk_product (integer, foreign key)
    - fk_customer (integer, foreign key)
    - rating (integer)
    - comment (string)
    - status (string)
    - created_at (timestamp)
    - updated_at (timestamp)

Business logic:
    Design a ProductReview module that manages customer reviews for products.
It should support CRUD operations, validate rating values (1–5), handle review statuses (pending, approved, rejected),
and provide repository access by product ID. Expose all functionality via a facade, following Spryker's modular structure
and coding conventions.

Create a new module in zed with the following files:
- src/Zed/[ModuleName]/Business/Folders with business models
- src/Zed/[ModuleName]/Business/[ModuleName]BusinessFactory.php
- src/Zed/[ModuleName]/Business/[ModuleName]Facade.php
- src/Zed/[ModuleName]/Business/[ModuleName]FacadeInterface.php
- src/Zed/[ModuleName]/Persistence/Propel/Schema/spy_[module_name].schema.xml
- src/Zed/[ModuleName]/Persistence/[ModuleName]EntityManager.php
- src/Zed/[ModuleName]/Persistence/[ModuleName]EntityManagerInterface.php
- src/Zed/[ModuleName]/Persistence/[ModuleName]Repository.php
- src/Zed/[ModuleName]/Persistence/[ModuleName]RepositoryInterface.php
- src/Zed/[ModuleName]/Communication/Plugin
- src/Zed/[ModuleName]/[ModuleName]DependencyProvider.php

### Code style conventions
Follow the code style conventions of the Spryker project.

### Persistence Layer
Add crud operations in the `EntityManager` and `Repository` classes.
   Repositories should extend `AbstractRepository` and implement the `RepositoryInterface`.
   The `EntityManager` should implement the `EntityManagerInterface`.
   Repository methods should return transfers, EntityManager methods should expect transfers as parameters.

### Transfer Object
Create a transfer object definition for entity in `src/Shared/[ModuleName]/Transfer/[module_name].transfer.xml`.

## Similar Module Example
Check src/Zed/Sales as an example of a module with a similar structure.

## Example Output

```text
src/
└── Zed/
    └── ProductReview/
        ├── Business/
        │   ├── Model/
        │   │   └── (Business model classes: e.g. ProductReviewWriter.php, ProductReviewReader.php, etc.)
        │   ├── ProductReviewBusinessFactory.php
        │   ├── ProductReviewFacade.php
        │   └── ProductReviewFacadeInterface.php
        ├── Communication/
        │   └── Plugin/
        ├── Persistence/
        │   ├── Propel/
        │   │   └── Schema/
        │   │       └── spy_product_review.schema.xml
        │   ├── ProductReviewEntityManager.php
        │   ├── ProductReviewEntityManagerInterface.php
        │   ├── ProductReviewRepository.php
        │   └── ProductReviewRepositoryInterface.php
        └── ProductReviewDependencyProvider.php
src/
└── Shared/
    └── ProductReview/
        └── Transfer/
            └── product_review.transfer.xml
```
