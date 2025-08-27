# Project Development Rules

## Architecture and Structure

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

### Repository Pattern
- Repository provides abstraction for entities in database
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

### CRUD Method Separation
Separate CRUD methods even with known code repetition. CRUD methods should not call one another under the hood.

### Generic Model Names
- **Forbidden**: Handler, Manager
- **Requires architecture check**: Helper (usually should be moved to service)
- Each model must have clear and single purpose

### Environment and Configuration
- **Environment configuration**: Used in `config_*.php`, different per environment
- **Environment constants**: Contain same UPPERCASE value as key, properly prefixed with `MODULE_NAME:`
```php
interface ModuleNameConstants {
    public const EXAMPLE_KEY = 'MODULE_NAME:EXAMPLE_KEY';
}
```
- **Module configuration**: Different per code deploy, use public getter methods, use `static::` everywhere to support extension
- **Module constants**: Always the same across environments

### Plugin Documentation
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

### Entity Transfers Scope
Entity Transfers are NOT allowed for usage inside public API methods (facades, plugins).

## Database and Performance

### Table Naming Convention
When a module provides a table, the table name must start with the source module name. This allows to raise dependency problems at an early stage and define tables scope.

### DB Bulk Operations
Insert/update operations on a single entity while having a collection of entities to process must be forbidden. Use bulk DB operations instead of individual queries in loops when processing multiple entities.

### Glossary Constants and Patterns
- Class constant must be used to declare the glossary key
- Glossary constant must follow pattern `GLOSSARY_KEY_*`
- Glossary key (constant value) must follow pattern `module_name.*`
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

### Transfer Objects Return Types
Transfer objects must have accurate return type declarations and not lie about returning types.

## Should NOT Follow (Project-specific decisions)

### Bridges
Bridges should NOT be implemented - assign dependencies directly to facades or other implementations instead of creating bridge interfaces.


### Extension Modules for New Plugins
Use existing plugin interfaces/or create interface in the module directly without requiring new Extension modules.



