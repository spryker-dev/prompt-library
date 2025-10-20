"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassKind = exports.SpecialMethods = exports.SelfReferences = exports.SpecialVariables = exports.AstResolution = exports.AstNodeKind = void 0;
exports.AstNodeKind = {
    NAMESPACE: 'namespace',
    USE_ITEM: 'useitem',
    USE_GROUP: 'usegroup',
    CLASS: 'class',
    INTERFACE: 'interface',
    METHOD: 'method',
    PROPERTY: 'property',
    CALL: 'call',
    STATIC_CALL: 'staticcall',
    NEW: 'new',
    VARIABLE: 'variable',
    ASSIGN: 'assign',
    PROPERTY_LOOKUP: 'propertylookup',
    NAME: 'name',
    NULLABLE_TYPE: 'nullabletype',
    RETURN: 'return',
};
exports.AstResolution = {
    FQN: 'fqn',
};
exports.SpecialVariables = {
    THIS: 'this',
};
exports.SelfReferences = {
    SELF: 'self',
    STATIC: 'static',
    PARENT: 'parent',
};
exports.SpecialMethods = {
    CONSTRUCT: '__construct',
    GET_FACTORY: 'getFactory',
    GET_BUSINESS_FACTORY: 'getBusinessFactory',
};
exports.ClassKind = {
    CLASS: 'class',
    INTERFACE: 'interface',
};
//# sourceMappingURL=ast-node-kinds.js.map