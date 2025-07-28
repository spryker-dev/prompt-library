# Spryker Coding Guidelines for AI Agents

This document outlines the core coding standards for Spryker projects. It is designed for automated code review and generation.

---

## 1. Code Style & Linting

- **Standard:** PSR-2 with Spryker additions.
- **Configuration:** Every repository must have a `phpcs.xml` in the root, checking `src/` and `tests/` directories.
- **Rulesets:**
    - `SprykerStrict`: For new modules or major versions.
    - `Spryker`: For existing code where BC breaks must be avoided.

## 2. General PHP Conventions

- **Comparison:**
    - **ALWAYS** use strict comparison (`===`, `!==`).
    - **AVOID** loose comparison (`==`, `!=`).
    - **AVOID** Yoda conditions (`if (5 === $id)`).
- **Cloaking (`isset`, `empty`, `??`):**
    - Use only for potentially undefined array keys or object properties.
    - For variables, use strict `null` comparison (`$var!== null`).
    - **NEVER** use `isset()` or `empty()` on method calls.
    - Prefer ternary `?:` over null coalescing `??` if "falsey" values (like `0`, `''`) should be handled as defaults.
- **Visibility:**
    - Use `protected` for methods and properties to allow project-level extension.
    - Use `private` only to explicitly prevent extension (e.g., infrastructure code).
    - **NEVER** use `final` on classes.
- **Dependency Injection:**
    - Use constructor injection.
    - Use PHP 8 constructor property promotion: `public function __construct(protected SomeInterface $someInterface) {}`.
    - Always depend on interfaces, not concrete classes.

## 3. Methods & Functions

- **Input arguments**
    - **Avoid** Scalar values and arrays of scalar values where applicable
    - Use Transfer objects
- **Return Types:**
    - Methods must have a single return type (or be nullable, e.g., `?int`).
    - Use `@return void` for methods with no return value (except constructors).
    - On failure, throw a specific exception (e.g., `CustomerNotFoundException`). **DO NOT** return `null`.
    - If a nullable return is required, prefer `null` over `false` to align with PHP type hints.
- **Multi-byte Strings:**
    - **ALWAYS** use multi-byte string functions (`mb_*`) for string operations.

## 4. Naming & Structure

- **Class Naming Convention:** `\\\`
    - **Namespace**: `Spryker`, `SprykerShop`, `Pyz` (project).
    - **Application**: `Zed`, `Yves`, `Client`, `Shared`, `Service`, `Glue`.
    - **Layer**: `Business`, `Communication`, `Persistence`.
    - **Example:** `Spryker\Zed\Calculation\CalculationDependencyProvider`
- **Constants:**
    - Use constants instead of magic strings or numbers when it is used more than once or when it can be better expressed with a name f.e. regex patterns.

## 5. Documentation (PHPDoc)

- **General:**
    - All methods require a docblock with `@param` and `@return` tags.
    - Comments should explain the "Why," not the "What."
- **API Documentation (Interfaces):**
    - The interface method contains the full description.
    - Format: Start with `Specification:`, followed by bullet points (`- My spec.`).
    - Transfers:
      - Usage of a transfer and it's properties **MUST** use `... TransferName.propertyName` ...
      - Inout and output **MUST** be well documented
    - The implementing class method **MUST** use `/** {@inheritDoc} */`.
    - Developer-only notes in the implementation can be added below `{@inheritDoc}` with a `Note:` prefix.
- **Legacy Code:**
    - Mark code branches for backward compatibility with `// Deprecated:` or `// Shim:`.
    - The legacy/shim code branch should appear first, following the "bail early" principle.
- **Linking:**
    - `@see`: For one-way links (e.g., to external documentation to controllers used by ZedStubs).
    - `@uses`: For two-way links between modules (e.g., shared constants).
- **Type Order:**
    - Place `null` or `false` last in type definitions (e.g., `@return int|null`).

## 6. Exceptions

- **Usage:**
    - Throw exceptions for errors, not for control flow.
    - Exception message **MUST** clearly explain in the shortest possible form what the issue is and ideally contain information on how to fix the issue.
    - **DO NOT** catch exceptions unless it's an expected error from an external service, a bulk operation that must continue, or for formatting a specific response (e.g., REST API).
- **Implementation:**
    - Throw custom, descriptive exceptions (e.g., `ProductNotFoundException`).
    - Place custom exceptions in the module's `/Exception/` directory.

## 7. Test Guidelines

- Tests **MUST NOT** depend on pre-existing database state.
- All required data/fixtures **MUST** be created by test helpers.
- Test helpers **MUST** clean up all created data after execution.
- Data builders **MUST** use a `unique()` method for unique fields. **DO NOT** use `rand()` or `word()`.
- When asserting data from a query, **DO NOT** rely on implicit row order. Use an explicit `ORDER BY` in the query if order is important.
- Manually reset any PHP-level code caches (e.g., for `Locale`) if they are manipulated during a test.
