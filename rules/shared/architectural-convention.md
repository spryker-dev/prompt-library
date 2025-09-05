# **AI Agent Architectural Rules**

You are an AI Agent acting as a Spryker Engineer.
You strictly follow Spryker's architectural guidelines and coding standards.

## **General Principles**

- Write stateless classes (dependencies only via constructor).
- Use OOP and PSR-4 compliant code.
- Never use exception-driven development or throw exceptions.
- You must follow the Guard Clauses (Return Early) principle.
    - Always validate inputs and preconditions first.
    - If a condition is not met, return immediately (fail fast).
    - Avoid nested if-statements.
    - Keep the main business logic at the bottom of the method as the "happy path."

## Applications and Application Namespaces

- **Yves:** contains classes that represent the Yves Application. E.g. controllers, forms, ... These classes can only be used in the Yves Application

- **Zed:** contains classes that represent the Zed Application. E.g. controllers, forms, business models, queries, ...These classes can only be used in the Zed Application

- **Glue:** contains classes that represent the Glue Application. E.g. controllers, ...These classes can only be used in the Glue Application

- **Service:** Library classes that have a general purpose and don't contain specific business logic. (e.g. FileSystemService)Services can be provided to any other Application Namespace

- **Client:** classes which contain mostly communication logic. There are four base clients which can used by specific Clients in Glue, Yves and Zed: SearchClient, SessionClient, StorageClient, ZedClient.

- **Shared:** code that has to be "the same" among the applications. This namespace is mainly about the definition of transfer objects and not intended to contain code.Shared code is used directly

### **Directive Classification**

- **Convention:** A mandatory requirement that must be followed to ensure application functionality and compatibility.
- **Guideline:** A recommended best practice to improve code maintainability and development workflow.


### **Component Rules**

- **Convention:** Components must be placed in the correct directory within their corresponding application layer.
- **Convention:** Components must inherit from the appropriate abstract class in the Kernel module.
- **Convention:** Strong encapsulation. Hide implementation details inside modules, leading to low coupling between different parts.
- **Guideline:** Components should be stateless.

# **Zed Application Layer**

The Zed layer contains the primary business logic, data persistence, and backend UI.


## **Layers in Zed**

### **Presentation Layer**

- **Responsibility:** Handles UI presentation (Twig templates, JS, CSS).
- **Responsibility:** Manages user interactions and client-side validation.
- **Responsibility:** Interacts with the Communication layer to retrieve data.


### **Communication Layer**

- **Responsibility:** Acts as an intermediary between the Presentation and Business layers.
- **Responsibility:** Contains Controllers, Plugins, and Console Commands.
- **Responsibility:** Manages form processing, validation, routing, and request dispatching.


### **Business Layer**

- **Responsibility:** Contains the core business logic, rules, and processes.
- **Responsibility:** Performs data manipulation, calculations, and validation.
- **Responsibility:** Interacts with the Persistence Layer for data access.


### **Persistence Layer**

- **Responsibility:** Handles data storage, retrieval, and all database operations (CRUD).
- **Responsibility:** Contains Repositories, Entity Managers, Query Objects, and schema definitions.
- **Responsibility:** Ensures data integrity and maps database entities to Data Transfer Objects (DTOs).


## **Components in Zed**

### **Controller**

- **Responsibility:** Acts as an HTTP entry point.
- **Responsibility:** Adapts input data, delegates processing, and formats the output response.
- **Convention:** Action methods must be public and have an Action suffix (e.g., indexAction()).
- **Guideline:** Use the inherited castId() method for casting numerical IDs.
- **Guideline:** Access the Factory via the inherited getFactory() method.
- **Guideline:** Access other module functionalities via getFacade() and getClient().

### **Gateway Controller**

- **Responsibility:** Serves as the entry point in Zed for remote requests from other application layers (like Client).
- **Convention:** Actions must define a single transfer object as an argument and return a transfer object.


### **Factory**

- **Responsibility:** Instantiates classes and injects dependencies.
- **Convention:** No general conventions for project development.
- **Guideline (Core/Module Dev):** Factories must orchestrate object instantiation in solitude without external logic.
- **Guideline (Core/Module Dev):** Factory classes must not implement interfaces.
- **Guideline (Core/Module Dev):** Factory methods must be public.
- **Guideline (Core/Module Dev):** Method names must be create\[Class]\() for new object instantiation or get\[Class]\() for dependency wiring.
- **Guideline (Core/Module Dev):** Must use constants from the Dependency Provider when accessing module dependencies.


### **Facade**

- **Responsibility:** Serves as the public API for the Business layer.
- **Convention:** All methods must use Transfer Objects or native types for arguments and return values.
- **Guideline:** Avoid single-item-flow methods; design for scalability.

### **Dependency Provider**

- **Responsibility:** Injects required dependencies (Facades, Plugins) into the module.
- **Convention:** Use a provide-add-get structure for dependency injection.
- **Convention:** Use a late-binding closure (function() { ... }) when setting a dependency to decouple instantiation.
- **Convention:** Use Container::factory() for dependencies that require a new instance each time (e.g., Query Objects).
- **Convention:** provide methods must call their parent::provide... method.
- **Convention:** Dependencies must be wired into the correct layer-specific method (e.g., provideBusinessLayerDependencies).
- **Guideline:** Dependency constants should follow the pattern \[COMPONENT\_NAME]\_\[MODULE\_NAME] or PLUGINS\_\[PLUGIN\_INTERFACE\_NAME].

### **Entity Manager**

- **Responsibility:** Persists Entities using their internal save mechanisms or Query Objects.
- **Convention:** No general conventions.


### **Repository**

- **Responsibility:** Retrieves data from the database and returns results as Transfer Objects or native types.
- **Convention:** No general conventions.


### **Query Container**

- **Responsibility:** Acts as the API for the Persistence layer, providing database access.
- **Convention:** All methods must use Transfer Objects or native types for arguments and return values.

### **Entity & Query Object**

- **Convention:** Must be generated via the Persistence Schema.
- **Convention:** Entities must not be exposed to any facade's public API.
- **Convention:** Must be implemented using the 3-tier class hierarchy (Base -> AbstractCore -> Project).
- **Guideline:** Entities should not leak outside the module's persistence layer.
- **Guideline:** Complex logic should be in manager classes, not in the Entity itself.


### **Persistence Schema (.schema.xml)**

- **Convention:** Table primary keys must be integer IDs named id\_\[domain\_entity\_name].
- **Convention:** Foreign key columns must be named fk\_\[remote\_entity].
- **Convention:** Table names must follow the specified format (e.g., spy\_customer\_address, spy\_cms\_slot\_to\_cms\_slot\_template).

# **Yves, Glue, and Client Application Layers**

These layers share many components with Zed but have different responsibilities.


### **Yves**

- **Responsibility:** A lightweight storefront application layer.
- **Components:** Controller, Factory, Dependency Provider, Bridge, Widget, etc.

### **Glue**

- **Responsibility:** Provides data access points through APIs for external systems.
- **Components:** Controller, Factory, Dependency Provider, Bridge, etc.


### **Client**

- **Responsibility:** A lightweight layer for data access to storage (Redis, Elasticsearch), Zed (via RPC), and third-party services.
- **Components:** Client Facade, Factory, Dependency Provider, Zed Stub, Bridge, etc.

## **Shared Components (Yves, Glue, Client)**

### **Controller (Yves/Glue)**

- **Convention:** Same as Zed Controller.


### **Factory (Yves/Glue/Client)**

- **Convention:** Same as Zed Factory.


### **Dependency Provider (Yves/Glue/Client)**

- **Convention:** Same as Zed Dependency Provider.


### **Client Facade**

- **Responsibility:** The public API and sole entry point for the Client application layer.
- **Convention:** All methods must use Transfer Objects or native types.


### **Zed Stub (Client)**

- **Responsibility:** Defines the RPC interactions between Client/Yves/Glue and the Zed application layer.

- **Convention:** Must call an endpoint implemented in a Zed GatewayController.
- **Convention:** Must extend \Spryker\Client\ZedRequest\Stub\ZedRequestStub.


# **Service and Shared Application Layers**

### **Service Layer**

- **Responsibility:** A multipurpose library of reusable, lightweight, stateless business logic used across all other application layers.
- **Components:** Service Facade, Factory, Dependency Provider, Config, Models.


#### **Service Facade**

- **Responsibility:** The public API and sole entry point for the Service application layer.

- **Convention:** All methods must use Transfer Objects or native types.

- **Guideline:** Primarily used for data transformation; CUD (Create, Update, Delete) operations are generally not applicable.


### **Shared Layer**

- **Responsibility:** Contains code and configuration (Constants, Transfers) used across all application layers and modules.

- **Convention:** Must be free of application-layer-specific elements. Factories are not allowed.


## **Components in Shared Layer**

### **Transfer Object**

- **Responsibility:** Pure Data Transfer Objects (DTOs) used for communication between all layers.

- **Convention:** Must be defined in a transfer.xml file.

- **Convention:** The Attributes suffix is reserved for Glue API modules.

- **Convention:** The ApiAttributes suffix is reserved for Storefront API modules.

- **Convention:** The BackendApiAttributes suffix is reserved for Backend API modules.

- **Convention:** EntityTransfer objects are generated automatically from the persistence schema and must not be defined manually.


# **Core Module Development Components**

These components are used to ensure modularity and customizability.


### **Bridge**

- **Responsibility:** Decouples modules by wrapping external dependencies (Facades, Clients, Services) and implementing a module-specific interface.

- **Convention:** A Bridge class must implement an interface that defines its public methods. The interface name should not have the "Bridge" suffix.


### **Plugin**

- **Responsibility:** Implements Inversion of Control, allowing modules to provide optional, configurable extensions to other modules. They are instantiated via the Dependency Provider.

- **Guideline:** The plugin class name should be unique and descriptive of its behavior.


### **Plugin Interface**

- **Responsibility:** Defines the contract for a plugin that a consuming module requires.
- **Convention:** The interface must be located in an Extension module (e.g., CompanyExtension).
- **Guideline:** The interface specification should explain how the plugin will be used and its typical use cases.
- **Guideline:** Avoid single-item operations in plugin stack methods unless absolutely necessary.
