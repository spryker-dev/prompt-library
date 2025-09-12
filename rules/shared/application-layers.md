# Application Layers

## Zed

### Responsibility
The Zed layer contains the primary business logic, persistence data, backend UI.

### Structure
```text
[Organization]
└── Zed
    └── [Module]
        ├── Presentation
        │   ├── Layout
        │   │   └── [layout-name].twig
        │   └── [name-of-controller]
        │       └── [name-of-action].twig
        ├── Communication
        │   ├── Controller
        │   │   ├── IndexController.php
        │   │   ├── GatewayController.php
        │   │   └── [Name]Controller.php
        │   ├── [CustomDirectory]
        │   │   ├── [ModelName]Interface.php
        │   │   └── [ModelName].php
        │   ├── Exception
        │   ├── Plugin
        │   │   └── [ConsumerModule]
        │   │       └── [PluginName]Plugin.php
        │   ├── Form
        │   │   ├── [Name]Form.php
        │   │   └── DataProvider
        │   │       └── [Name]FormDataProvider.php
        │   ├── Table
        │   │   └── [Name]Table.php
        │   ├── navigation.xml
        │   └── [Module]CommunicationFactory.php
        ├── Business
        │   ├── [CustomDirectory]
        │   │   ├── [ModelName]Interface.php
        │   │   └── [ModelName].php
        │   ├── Exception
        │   ├── [Module]BusinessFactory.php
        │   ├── [Module]Facade.php
        │   └── [Module]FacadeInterface.php
        ├── Persistence
        │   ├── [Module]EntityManagerInterface.php
        │   ├── [Module]EntityManager.php
        │   ├── [Module]QueryContainer.php
        │   ├── [Module]PersistenceFactory.php
        │   ├── [Module]RepositoryInterface.php
        │   ├── [Module]Repository.php
        │   └── Propel
        │       ├── Abstract[TableName].php
        │       ├── AbstractSpy[TableName]Query.php
        │       ├── Mapper
        │       │   └── [Module|Entity]Mapper.php
        │       └── Schema
        │           └── [organization_name]_[domain_name].schema.xml
        ├── Dependency
        │   ├── Client
        │   │   ├── [Module]To[Module]ClientBridge.php
        │   │   └── [Module]To[Module]ClientInterface.php
        │   ├── Facade
        │   │   ├── [Module]To[Module]FacadeBridge.php
        │   │   └── [Module]To[Module]FacadeInterface.php
        │   ├── QueryContainer
        │   │   ├── [Module]To[Module]QueryContainerBridge.php
        │   │   └── [Module]To[Module]QueryContainerInterface.php
        │   ├── Service
        │   │   ├── [Module]To[Module]ServiceBridge.php
        │   │   └── [Module]To[Module]ServiceInterface.php
        │   └── Plugin
        │       └── [PluginInterfaceName]PluginInterface.php
        ├── [Module]Config.php
        └── [Module]DependencyProvider.php
```

### Layers in Zed
- Presentation
- Communication
- Business
- Persistence

### Used components
- Bridge
- Config
- Controller
- Dependency provider
- Entity
- Entity Manager
- Facade
- Factory
- Gateway controller
- Layout
- Mapper / Expander / Hydrator
- Models
- navigation.xml
- Plugin, Plugin Interface
- Query container
- Query object
- Repository
- Schema

## Yves

### Responsibility
- A lightweight storefront application layer.

### Structure
```text
[Organization]
└── Yves
    └── [Module]
        ├── Controller
        │   ├── IndexController.php
        │   └── [Name]Controller.php
        ├── [CustomDirectory]
        │   ├── [ModelName]Interface.php
        │   └── [ModelName].php
        ├── Dependency
        │   ├── Client
        │   │   ├── [Module]To[Module]ClientBridge.php
        │   │   └── [Module]To[Module]ClientInterface.php
        │   ├── Service
        │   │   ├── [Module]To[Module]ServiceBridge.php
        │   │   └── [Module]To[Module]ServiceInterface.php
        │   └── Plugin
        │       └── [PluginInterfaceName]PluginInterface.php
        ├── Plugin
        │   ├── Provider
        │   │   └── [Name]ControllerProvider.php
        │   └── [ConsumerModule]
        │       ├── [PluginName]Plugin.php
        │       └── [RouterName]Plugin.php
        ├── Theme
        │   └── ["default"|theme]
        │       ├── components
        │       │   ├── organisms
        │       │   │   └── [organism-name]
        │       │   │       └── [organism-name].twig
        │       │   ├── atoms
        │       │   │   └── [atom-name]
        │       │   │       └── [atom-name].twig
        │       │   └── molecules
        │       │       └── [molecule-name]
        │       │           └── [molecule-name].twig
        │       ├── templates
        │       │   ├── page-layout-[page-layout-name]
        │       │   │   └── page-layout-[page-layout-name].twig
        │       │   └── [template-name]
        │       │       └── [template-name].twig
        │       └── views
        │           └── [name-of-controller]
        │               └── [name-of-action].twig
        ├── Widget
        │   └── [Name]Widget.php
        ├── [Module]Config.php
        ├── [Module]DependencyProvider.php
        └── [Module]Factory.php
```
### Used components
- Bridge
- Config
- Controller
- Dependency Provider
- Factory
- Layout
- Mapper / Expander / Hydrator
- Model
- Provider / Router
- Plugin, Plugin Interface
- Templates
- Theme
- Widget

## Glue

### Responsibility
- Responsibility: Provides data access points through APIs for external systems.

### Structure
```text
[Organization]
└── Glue
    └── [Module]
        ├── Controller
        │   ├── IndexController.php
        │   └── [Name]Controller.php
        ├── [CustomDirectory]
        │   ├── [ModelName]Interface.php
        │   └── [ModelName].php
        ├── Dependency
        │   ├── Client
        │   │   ├── [Module]To[Module]ClientBridge.php
        │   │   └── [Module]To[Module]ClientInterface.php
        │   ├── Facade
        │   │   ├── [Module]To[Module]FacadeBridge.php
        │   │   └── [Module]To[Module]FacadeInterface.php
        │   ├── QueryContainer
        │   │   ├── [Module]To[Module]QueryContainerBridge.php
        │   │   └── [Module]To[Module]QueryContainerInterface.php
        │   ├── Service
        │   │   ├── [Module]To[Module]ServiceBridge.php
        │   │   └── [Module]To[Module]ServiceInterface.php
        │   └── Plugin
        │       └── [PluginInterfaceName]PluginInterface.php
        ├── Plugin
        │   ├── Provider
        │   │   └── [Name]ControllerProvider.php
        │   └── [ConsumerModule]
        │       └── [PluginName]Plugin.php
        ├── [Module]Config.php
        ├── [Module]DependencyProvider.php
        └── [Module]Factory.php
```

### Used components
- Bridge
- Config
- Controller
- Dependency Provider
- Factory
- Layout
- Mapper / Expander / Hydrator
- Model
- Provider / Router

## Client

A lightweight layer for data access to storage (Redis, Elasticsearch), Zed (via RPC), and third-party services.

### Structure
```text
[Organization]
└── Client
    └── [Module]
        ├── [CustomDirectory]
        │   ├── [ModelName]Interface.php
        │   └── [ModelName].php
        ├── Dependency
        │   ├── Client
        │   │   ├── [Module]To[Module]ClientBridge.php
        │   │   └── [Module]To[Module]ClientInterface.php
        │   ├── Service
        │   │   ├── [Module]To[Module]ServiceBridge.php
        │   │   └── [Module]To[Module]ServiceInterface.php
        │   └── Plugin
        │       └── [PluginInterfaceName]PluginInterface.php
        ├── Plugin
        │   └── [ConsumerModule]
        │       └── [PluginName]Plugin.php
        ├── Zed
        │   ├── [Module]Stub.php
        │   └── [Module]StubInterface.php
        ├── [Module]ClientInterface.php
        ├── [Module]Client.php
        ├── [Module]Config.php
        ├── [Module]DependencyProvider.php
        └── [Module]Factory.php
```

### Used components
- Bridge
- Client facade
- Config
- Dependency Provider
- Factory
- Mapper / Expander / Hydrator
- Model
- Plugin, Plugin Interface
- Zed Stub

## Service

### Responsibility
- Responsibility: A multipurpose library of reusable, lightweight, stateless business logic used across all other application layers.

### Structure
```text
[Organization]
└── Service
    └── [Module]
        ├── [CustomDirectory]
        │   ├── [ModelName]Interface.php
        │   └── [ModelName].php
        ├── [Module]Config.php
        ├── [Module]DependencyProvider.php
        ├── [Module]ServiceFactory.php
        ├── [Module]ServiceInterface.php
        └── [Module]Service.php
```


### Used components
- Config
- Dependency Provider
- Factory
- Mapper / Expander / Hydrator
- Model
- Service facade

## Shared

### Responsibility
- Responsibility: Contains code and configuration (Constants, Transfers) used across all application layers and modules.

### Convention
- Convention: Must be free of application-layer-specific elements. Factories are not allowed.

### Structure
```
[Organization]
└── Shared
    └── [Module]
        ├── Transfer
        │   └── [module_name].transfer.xml
        ├── [Module]Constants.php
        └── [Module]Config.php
```

### Used components
- Config
- Constants
- Transfer
