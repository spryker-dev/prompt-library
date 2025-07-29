# Spryker Architecture Guide for AI Agents

This guide provides a concise, machine-readable summary of Spryker's architectural principles, focusing on public API contracts and development best practices. Use this for code generation and automated code reviews.

Internal docs:
- 

---

## 1. Core Principles: API Contracts

Spryker uses a "Design by Contract" approach. The type of contract is identified by annotations.

- **`@api` (PHP-level Contract):**
    - **Purpose:** Marks a class or method as part of the stable, internal PHP API.
    - **Guarantee:** Backward compatibility (BC) is maintained for minor/patch versions.
    - **Use Case:** For module-to-module communication within the backend (Zed).
    - **Rule:** All public `Facade` methods *must* have the `@api` tag.

- **`@Glue` (HTTP-level Contract):**
    - **Purpose:** Defines the contract for an external-facing Glue REST API endpoint.
    - **Format:** JSON-like annotation in a Controller's action method docblock.
    - **Guarantee:** Stability for the HTTP endpoint, its URL, and JSON payload structure.
    - **Use Case:** For external clients (SPAs, mobile apps, third-party systems).

---

## 2. Class Archetypes & API Status

### 2.1. Public API (Callable PHP Contracts)

These are the primary, stable interfaces for inter-module communication. **ALWAYS use these for cross-module logic.**

| Component | Role | API Contract & Interaction |
|---|---|---|
| **Facade** | The *only* official entry point to a module's business logic in Zed. | **PUBLIC API**. Call methods defined in `ModuleFacadeInterface`. Methods are marked with `@api`. |
| **Client** | The entry point for communication *between* applications (e.g., Yves/Glue to Zed). | **PUBLIC API**. Call methods defined in `ModuleClientInterface`. Acts as an RPC proxy. |
| **Plugin** | Extends/modifies another module's behavior via dependency injection (Inversion of Control). | **PUBLIC API (Implementation Contract)**. Implement a `PluginInterface` from the target module. Register in `DependencyProvider`. |
| **Service** | Provides reusable, cross-cutting functionality (e.g., file system access). | **PUBLIC API**. Call methods defined in `ModuleServiceInterface`. |
| **Transfer Object** | Standardized, immutable Data Transfer Objects (DTOs) for data exchange. | **PUBLIC API (Data Contract)**. Used as parameters and return types for Facades/Clients. Their structure is part of the contract. |

### 2.2. Alternative API Entry Points (Non-PHP Contracts)

These are public entry points but are **NOT for direct PHP-level calls between modules.**

| Component | Role | API Contract & Interaction |
|---|---|---|
| **Controller** | Entry point for HTTP requests (Yves/Glue). | **HTTP API**. Contract is for external HTTP clients, defined by the `@Glue` annotation. **NEVER** call from PHP. |
| **Console Command** | Entry point for Command-Line Interface (CLI) tasks. | **CLI API**. Contract is the command signature (name, args, options). For terminal use only. **NEVER** call from PHP. |

### 2.3. Configuration API (Declarative Contracts)

These components are for configuring module behavior, not for executing business logic. **EXTEND these at the project level to customize.**

| Component | Role | API Contract & Interaction |
|---|---|---|
| **DependencyProvider** | Injects dependencies, primarily `Plugins`, into a module. | **CONFIG API**. Extend the class and override methods to add/remove plugins. Keep logic simple (e.g., `class_exists`). |
| **ModuleConfig** | Provides module-specific, environment-independent configuration. | **CONFIG API**. Extend the `ModuleConfig` class and override methods to change behavior. |
| **ModuleConstants** | Defines keys for environment-dependent configuration values. | **CONFIG API**. Use constants from the interface to get values from `config_default.php` files. |

### 2.4. Internal Components (Private API)

These components are implementation details of a module. **NEVER access these from another module.**

| Component | Role | API Status & Correct Usage |
|---|---|---|
| **Business Model** | Implements the core business logic (e.g., Readers, Writers). | **INTERNAL**. Hidden behind the Facade. **NEVER** call directly. |
| **Repository** | Reads data from the persistence layer. | **INTERNAL**. Access its functionality via a `Facade` method. |
| **EntityManager** | Writes data (CUD operations) to the persistence layer. | **INTERNAL**. Access its functionality via a `Facade` method. |
| **QueryContainer** | Aggregates database queries. | **INTERNAL / DEPRECATED** for cross-module use. Use `Repository` instead. |

---

## 3. Rules for Code Review & Generation

### DO:
- **Interact via Public APIs:** ALWAYS use `Facades`, `Clients`, `Services`, and `Plugins` for cross-module communication.
- **Use Interfaces:** Depend on interfaces (`ModuleFacadeInterface`, `PluginInterface`, etc.), not concrete classes.
- **Extend for Customization:** Use `DependencyProviders` to register plugins and extend `ModuleConfig` classes for configuration changes.
- **Respect API Boundaries:** Understand the difference between `@api` (PHP) and `@Glue` (HTTP) contracts.
- **Use Transfer Objects:** Pass data between layers and modules exclusively with Transfer Objects.
- **Core/Vendor Code:** Write code in Spryker modules when you're asked to do.
- **Project Code:** Write code in the project level (`Pyz` or custom project namespace) when needed or explicitly asked.

### DON'T:
- **NEVER Call Internal Components:** Do not directly access another module's `Repository`, `EntityManager`, `QueryContainer`, or any class in its `Business` layer. This is a critical architectural violation.
- **NEVER Call Controllers or Commands from PHP:** Do not instantiate or call methods on `Controller` or `Console` classes from other modules.
- **NEVER Bypass the Facade:** Do not access the `Business` or `Persistence` layers of another module directly. The `Facade` is the only valid entry point.
