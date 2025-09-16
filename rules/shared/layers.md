# Layer Responsibilities

## Presentation Layer

#### Responsibility
- Handles UI presentation (Twig templates, JS, CSS).
- Manages user interactions and client-side validation.
- Contains frontend assets: HTML, Twig templates, JS, TypeScript, CSS files
- Handles user interactions and input validations on the client side
- Interacts with the Communication layer to retrieve data for display

### Communication Layer
- Acts as an intermediary between the Presentation layer and the Business layer
- Contains controllers responsible for handling HTTP requests and responses
- Contains plugins responsible for flexible, overarching requests and responses
- Contains console commands
- Manages form processing and validation
- Handles routing and dispatching requests to appropriate controllers
- Interacts with the Business layer to perform business operations

### Business Layer
- Contains the main business logic
- Implements business rules and processes
- Performs data manipulation, calculations, and validation
- Interacts with the Persistence Layer to read and write data

### Persistence Layer
- Responsible for data storage and retrieval
- Contains queries (via Entity Manager or Repository), entities (data models), and database schema definitions
- Handles database operations such as CRUD: create, read, update, delete
- Ensures data integrity and security
- Maps database entities into business data transfer objects

