# Spryker: Major Versioning & Avoidance Guide for AI Agents

This guide defines what constitutes a major version change in Spryker and provides tactics to avoid them where possible. Use this for code review and to make architectural decisions that maintain backward compatibility.

Internal docs:
- https://spryker.atlassian.net/wiki/spaces/CORE/pages/3048767586/Is+my+module+change+major
- https://spryker.atlassian.net/wiki/spaces/CORE/pages/3038216249/Major+release+avoidance+tactics

---

## 1. Database

| Case | Major? |
|---|---|
| Adding a table | Yes |
| Adding an optional table | Ambiguous |
| Changing column type | Yes |
| Deleting a table column | Yes |
| Adding unique index | Yes |
| Changing a unique index's fields | Yes |
| Changing the name of any index | Yes |
| Lowering a DB field's length | Yes |
| Adding a b-tree index | No |

### Case: Adding a column to an existing table
- **Major Change:** Yes
- **Avoidance Tactics:**
    1.  **Define in Owning Module:** If a new column `Product.fkProductImage` is needed for the `ProductImage` module, define it from the `ProductImage` module's schema. This keeps the `Product` module stable.
    2.  **Define in Consuming Module (Temporary):** Define the new column in the module that currently needs it to postpone the major release of the owning module.
        - **Tech Debt:** The column definition **MUST** be moved to the correct owning module in the next major release.
    3.  **Make Column Optional (Use with extreme caution):**
        - Make the column optional in the schema so migrations are not mandatory.
        - The code **MUST** handle cases where the column does not exist.
        - **Rule:** This requires architect approval and is a last resort.
        - **Tech Debt:** The code **MUST** be refactored in the next major to assume the column exists.

---

## 2. Module API (Facades, Clients, etc.)

| Case | Major? |
|---|---|
| Removing a method | Yes |
| Adding a required method argument | Yes |
| Adding strict type for existing method arguments | Yes |
| Adding strict return type for existing methods | Yes |
| Removing the strict type of existing method arguments | Yes |
| Renaming/deleting dependency provider methods | Yes |
| Changing a module config's default return value | Yes |
| Changing controller action return data type | Yes |
| Reducing returned data in a controller action | Yes |
| Changing/deleting existing transfer objects or properties | Yes |
| Removing usage of existing glossary keys | Yes |
| Changing/renaming existing glossary keys | Yes |
| Adding a method | No |
| Adding an optional method argument | No |
| Changing a required method argument to optional | No |
| Removing the strict return type of existing methods | No |
| Expanding returned data in a controller action | No |
| Adding new properties to existing transfer objects | No |

### Case: Changing a method signature
- **Major Change:** Yes
- **Avoidance Tactic:**
    - Create a new method with the desired signature.
    - Mark the old method with `@deprecated`, pointing to the new method.
    - **Tech Debt:** The deprecated method **MUST** be removed in the next major release.

### Case: Changing a method's return type
- **Major Change:** Yes
- **Avoidance Tactic:**
    1.  **Minor Release:** Remove the strict return type from the method. Update the docblock to include both old and new types (e.g., `@return MyOldTransfer|MyNewTransfer`). Add a `E_USER_DEPRECATED` trigger to log when the old type is returned.
    2.  **Major Release:** Add the new strict return type to the method signature and remove the old type from the docblock and any related deprecation logic.
    - **Tech Debt:** The method **MUST** be updated with the new strict type in the next major release.

### Case: Adding a new glossary key
- **Major Change:** Yes
- **Avoidance Tactic:** Follow the established RFC for adding glossary keys in a backward-compatible way.

---

## 3. Plugins

| Case | Major? |
|---|---|
| Adding new mandatory method argument in a plugin interface | Yes |
| Adding new method in plugin interface | Yes |
| Changing anything in a plugin interface method signature | Yes |
| Changing plugin behavior that violates the original contract | Yes |
| Adding new optional method argument in a plugin interface | Yes |

### Case: Changing a plugin interface signature
- **Major Change:** Yes
- **Avoidance Tactic:**
    - Create a new interface with the desired signature (e.g., `ProductExpanderWithPayloadPluginInterface`).
    - Mark the old interface with `@deprecated`, pointing to the new one.
    - **Tech Debt:** The deprecated interface **MUST** be removed in the next major release.

### Case: Moving a plugin interface to an Extension module
- **Major Change:** Yes (Implicitly)
- **Avoidance Tactic:**
    - In the old location, make the old interface extend the new interface in the Extension module.
    - Mark the old interface with `@deprecated`.
    - **Tech Debt:** The deprecated interface **MUST** be removed in the next major release.

---

## 4. Public API (Glue & Console)

| Case | Major? |
|---|---|
| Changing URL of a controller action | Yes |
| Changing the name of a console command | Yes |
| Adding new mandatory arguments for existing console commands | Yes |
| Changing the name of an existing Glue resource | Yes |
| Deleting existing Glue resource HTTP method(s) | Yes |
| Adding new required request parameters for existing Glue resources | Yes |
| Changing/deleting existing response parameters for Glue resources | Yes |
| Adding new optional arguments for existing console commands | No |
| Adding new HTTP method(s) to existing Glue resources | No |
| Adding new optional request parameters for existing Glue resources | No |
| Adding new response parameters for existing Glue resources | No |

---

## 5. Composer Dependencies

| Case | Major? |
|---|---|
| Adding a Spryker module dependency that requires migration | Yes |
| Increasing a Spryker module dependency on a major (e.g., `^5.0` -> `^6.0`) | Yes |
| Removing support for a previously supported major version | Yes |
| Removing a 3rd party dependency | Manual Eval |
| Adding a 3rd party dependency | No |
| Adding a Spryker module dependency without migration effort | No |
| Adding support for a new major (e.g., `^5.0` -> `^5.0 |
| ^6.0`) | No |

### Edge Case: Dependency Updates
- If a third-party dependency major version must be removed due to an impossible constraint (e.g., PHP version conflict), this is a **minor** release. Composer will prevent installation of the invalid combination.

---

## 6. Other Categories

| Category | Case | Major? |
|---|---|---|
| **Storage** | Adding new key pattern requiring data migration | Yes |
| | Removing/changing existing key pattern | Yes |
| | Adding new optional key pattern (no migration needed) | No |
| **Search** | Removing document type | Yes |
| | Changing existing schema properties (e.g., field type) | Yes |
| | Adding document type | No |
| **Templates (Twig)** | Removing input arguments | Yes |
| | Adding required input arguments | Yes |
| | Adding optional input arguments | No |
| **Business Logic** | Changing internal classes/methods (no public API impact) | No |
| **Misc** | Adding/changing Zed translations | No |
| | Changing a databuilder property | No |
