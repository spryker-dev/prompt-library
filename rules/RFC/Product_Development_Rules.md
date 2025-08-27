# Product Development Rules

These are MUST-FOLLOW rules for Product Development teams working on Spryker Core.

## Environment and Configuration

### Env Constants vs Config Constants
- **Environment configuration**: Used in `config_*.php`, different per environment, always in Shared layer
- **Environment constants**: Contain same UPPERCASE value as key, properly prefixed with `MODULE_NAME:`
```php
interface ModuleNameConstants {
    public const EXAMPLE_KEY = 'MODULE_NAME:EXAMPLE_KEY';
}
```
- **Module configuration**: Different per code deploy, use public getter methods, use `static::` everywhere to support extension
- **Module constants**: Always the same across environments

### Shared Layer Configuration
Modules that have transferable data must contain shared layer configuration. Shared layer is accessible from all application layers.

## Architecture and Structure

### Bridges
- Bridges decouple relations across OS modules, only for CORE
- Place bridges in `/Dependency/` folder
- **Interface naming**: `{Module}To{TargetModule}{Layer}Interface` (e.g. `SalesToCalculationFacadeInterface`)
- **Bridge naming**: `{Module}To{TargetModule}{Layer}Bridge` (e.g. `SalesToCalculationFacadeBridge`)
- Bridge constructor has single input parameter without code typehint
- Bridge methods have exactly same signature as their interface

### Business Logic Structure
Organize within Business directory by logical connection or entity:
- `*Reader`: reads and optionally hydrates entities
- `*Writer`: saves/creates/deletes entities  
- `*Expander`: adds new data to another
- `*Mapper`: maps data between data sources in Persistence Layer
```
Business\
  EntityA\
    EntityAReader.php
    EntityAWriter.php
```

### Repository for Persistence Layer
- Repository provides abstraction for entities stored in database
- Repository contains only reading methods
- Use Entity Manager for writing operations
- Repository methods return Transfer objects, not Propel entities

### Cross Module Propel Query Usage
Use `@module` keyword in Persistence layer upon joins:
```php
/**
 * @module Customer
 * @module Company
 */
public function getCompanyUserById(int $idCompanyUser): CompanyUserTransfer
{
    $query = $this->getFactory()
        ->getCompanyUserQuery()
        ->leftJoinWithCustomer() // spy_customer defined in Customer module
        ->leftJoinWithCompany()  // spy_company defined in Company module
}
```
When module lacks initial Query, inject via DependencyProvider with `PROPEL_QUERY_*` constants.

## Code Quality and Naming

### Create and Update Separation  
Separate CRUD methods even with known code repetition. CRUD methods should not call one another under the hood.

### Disallow Generic Model Names
- **Forbidden**: Handler, Manager
- **Requires architecture check**: Helper (usually should be moved to service)
- Each model must have clear and single purpose

### Public Methods in Core Factories
Make all factory methods public by default, independent of internal or external usage. No exceptions.

### Transfer Objects Return Types
Transfer objects must have accurate return type declarations and not lie about returning types.

### Self vs None Return Types
- Use `self` when method returns instance of the same class
- Use `none` for void methods
- Be consistent in return type usage across codebase

## Plugin Development

### Extension Modules for New Plugins
When creating new plugins:
1. Add new extension module (if not exists)
2. Define new interface with public interface of old interface  
3. Make old interface extend new interface and remove content
4. Replace usage of old interface with new interface
5. Define dependency to extension module
6. New plugin uses new interface

### Plugin Specification
All plugins must have their own specification with description of what it does:
```php
/**
 * Specification:
 * - Resolves quote name if it's not set
 * - Uses facade method to generate appropriate name
 * - Returns modified quote transfer
 */
```
Do NOT use `{@inheritdoc}` in plugin method doc blocks.

### Reduce Scope of Entity Transfers
Entity Transfers are NOT allowed for usage inside Spryker public API methods (e.g facades, plugins etc).

## Database and Performance

### Table Naming Convention
When a module provides a table, the table name MUST start with the source module name. This allows to raise dependency problems at an early stage and define tables scope.

### DB Bulk Operations
Insert/update operations on a single entity while having a collection of entities to process MUST be forbidden. Use bulk DB operations instead of individual queries in loops when processing multiple entities.

### Glossary Constants and Patterns
- Class constant MUST be used to declare the glossary key
- Glossary constant MUST follow pattern `GLOSSARY_KEY_*`
- Glossary key (constant value) MUST follow pattern `module_name.*`
```php
// Correct
protected const GLOSSARY_KEY_LOCKED_CART_CHANGE_DENIED = 'cart.locked.change_denied';

// Wrong
protected const LOCKED_CART_CHANGE_DENIED = 'locked.change_denied';
```

## Modern PHP Features

### Constructor Property Promotion
Use PHP 8 constructor property promotion to reduce boilerplate code:
```php
// Use this
public function __construct(
    protected TaxAppHeaderBuilderInterface $taxAppHeaderBuilder,
) {
}

// Instead of this
protected TaxAppHeaderBuilderInterface $taxAppHeaderBuilder;
public function __construct(TaxAppHeaderBuilderInterface $taxAppHeaderBuilder) {
    $this->taxAppHeaderBuilder = $taxAppHeaderBuilder;
}
```

## Publish & Synchronization Modules

### Publisher Plugins
- Create with naming pattern: `{ResourceName}WritePublisher` and `{ResourceName}DeletePublisher`
- Must implement `PublisherPluginInterface` from Publisher module
- Must not contain business logic, only propagate calls to Facade API
- Place in folders grouped by entity: `..\Plugin\Publisher\{EntityName}\`
- Do not use "Storage" or "Search" terms in Publisher plugin names

### Events Registration
- Register events in storage/search module configuration: `..\Shared\{ModuleName}Storage\{ModuleName}StorageConfig.php`
- Events belong to module that owns the table (e.g. Entity.spy_product.create belongs to spryker/product)
- Register events inside Publisher plugins using `PublisherPluginInterface::getSubscribedEvents()`
- Register Publisher plugins in `PublisherDependencyProvider.php` at project level

### Synchronization Plugins
- Must implement `SynchronizationDataBulkRepositoryPluginInterface`
- Must use queries with `SynchronizationDataTransferObjectFormatter` to prevent multiple mapping

### Business Layer Classes
Models must provide separated classes:
- `{Resource}Writer` - for writing operations
- `{Resource}Deleter` - for deleting operations
- `{Resource}Mapper` - for mapping storage/search entities

### P&S Module Structure
```
+ src/
  + Spryker/
    + Zed/
      + (module name)/
        + Business/
          + Writer/
          + Deleter/
          + Mapper/
        + Communication/
          + Plugin/
            + Publisher/
              + (event name)/
            + Synchronization/
        + test/
```

