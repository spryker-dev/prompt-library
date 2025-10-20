export declare const AstNodeKind: {
    readonly NAMESPACE: "namespace";
    readonly USE_ITEM: "useitem";
    readonly USE_GROUP: "usegroup";
    readonly CLASS: "class";
    readonly INTERFACE: "interface";
    readonly METHOD: "method";
    readonly PROPERTY: "property";
    readonly CALL: "call";
    readonly STATIC_CALL: "staticcall";
    readonly NEW: "new";
    readonly VARIABLE: "variable";
    readonly ASSIGN: "assign";
    readonly PROPERTY_LOOKUP: "propertylookup";
    readonly NAME: "name";
    readonly NULLABLE_TYPE: "nullabletype";
    readonly RETURN: "return";
};
export declare const AstResolution: {
    readonly FQN: "fqn";
};
export declare const SpecialVariables: {
    readonly THIS: "this";
};
export declare const SelfReferences: {
    readonly SELF: "self";
    readonly STATIC: "static";
    readonly PARENT: "parent";
};
export declare const SpecialMethods: {
    readonly CONSTRUCT: "__construct";
    readonly GET_FACTORY: "getFactory";
    readonly GET_BUSINESS_FACTORY: "getBusinessFactory";
};
export declare const ClassKind: {
    readonly CLASS: "class";
    readonly INTERFACE: "interface";
};
export type AstNodeKindType = typeof AstNodeKind[keyof typeof AstNodeKind];
export type ClassKindType = typeof ClassKind[keyof typeof ClassKind];
//# sourceMappingURL=ast-node-kinds.d.ts.map