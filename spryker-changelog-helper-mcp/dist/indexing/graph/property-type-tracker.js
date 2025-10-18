"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyTypeTracker = void 0;
const name_resolver_1 = require("../../utils/name-resolver");
const property_type_extractor_1 = require("../property/property-type-extractor");
const ast_node_kinds_1 = require("../constants/ast-node-kinds");
class PropertyTypeTracker {
    constructor(logger) {
        this.logger = logger;
    }
    processPropertyDeclaration(property, classFqn, propertyTypes, currentNamespace, currentUses) {
        const propertyType = this.extractPropertyType(property, currentNamespace, currentUses);
        if (propertyType) {
            this.registerPropertyTypes(property, classFqn, propertyTypes, propertyType);
        }
    }
    trackPropertyAssignment(assign, classFqn, propertyTypes, resolveExprType) {
        const propertyLookup = assign.left;
        const isThisProperty = propertyLookup.what?.kind === ast_node_kinds_1.AstNodeKind.VARIABLE
            && propertyLookup.what.name === ast_node_kinds_1.SpecialVariables.THIS;
        if (isThisProperty) {
            const propertyName = name_resolver_1.NameResolver.getIdentifierName(propertyLookup.offset);
            const propertyType = resolveExprType(assign.right);
            if (propertyName && propertyType) {
                propertyTypes[propertyName] = propertyType;
                this.logger?.('[prop-type]', `${classFqn}::$${propertyName}`, '=>', propertyType);
            }
        }
    }
    trackLocalVariable(assign, localTypes, currentNamespace, currentUses) {
        const variableName = typeof assign.left.name === 'string'
            ? assign.left.name
            : null;
        const className = name_resolver_1.NameResolver.resolveName(assign.right.what, currentNamespace, currentUses);
        if (variableName && className) {
            localTypes[variableName] = className;
        }
    }
    extractPropertyType(property, currentNamespace, currentUses) {
        const declaredType = this.extractDeclaredType(property, currentNamespace, currentUses);
        if (declaredType)
            return declaredType;
        const docText = property_type_extractor_1.PropertyTypeExtractor.collectCommentText(property);
        return property_type_extractor_1.PropertyTypeExtractor.extractVarFqnFromDoc(docText, currentNamespace, currentUses);
    }
    extractDeclaredType(property, currentNamespace, currentUses) {
        if (!property.type)
            return null;
        const typeNode = property.type.kind === ast_node_kinds_1.AstNodeKind.NULLABLE_TYPE
            ? property.type.what
            : property.type;
        return name_resolver_1.NameResolver.resolveName(typeNode, currentNamespace, currentUses);
    }
    registerPropertyTypes(property, classFqn, propertyTypes, propertyType) {
        for (const prop of property.properties || []) {
            const propertyName = this.extractPropertyName(prop);
            if (propertyName && !propertyTypes[propertyName]) {
                propertyTypes[propertyName] = propertyType;
                this.logger?.('[prop-decl]', `${classFqn}::$${propertyName}`, '=>', propertyType);
            }
        }
    }
    extractPropertyName(property) {
        if (property.name?.name) {
            return String(property.name.name);
        }
        if (typeof property.name === 'string') {
            return property.name;
        }
        return null;
    }
}
exports.PropertyTypeTracker = PropertyTypeTracker;
//# sourceMappingURL=property-type-tracker.js.map