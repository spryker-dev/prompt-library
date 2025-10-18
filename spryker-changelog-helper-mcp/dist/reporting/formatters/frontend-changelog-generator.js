"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontendChangelogGenerator = void 0;
class FrontendChangelogGenerator {
    generate(changes) {
        const entries = [];
        for (const change of changes) {
            entries.push(...this.generateEntriesForChange(change));
        }
        return entries;
    }
    generateEntriesForChange(change) {
        const entries = [];
        const componentRef = this.formatComponentReference(change.componentName, change.componentType);
        if (change.changeType === 'added') {
            entries.push(...this.generateAddedComponentEntries(change, componentRef));
        }
        else if (change.changeType === 'deleted') {
            entries.push(...this.generateDeletedComponentEntries(change, componentRef));
        }
        else if (change.changeType === 'modified') {
            entries.push(...this.generateModifiedComponentEntries(change, componentRef));
        }
        return entries;
    }
    generateAddedComponentEntries(change, componentRef) {
        const entries = [];
        // New component
        if (change.componentType === 'atom' || change.componentType === 'molecule' || change.componentType === 'organism') {
            entries.push({
                type: 'improvement',
                category: 'component',
                description: `Introduced ${componentRef}.`,
                component: change.componentName,
            });
        }
        return entries;
    }
    generateDeletedComponentEntries(change, componentRef) {
        const entries = [];
        // Removed component
        if (change.componentType === 'atom' || change.componentType === 'molecule' || change.componentType === 'organism') {
            entries.push({
                type: 'breaking',
                category: 'component',
                description: `Removed ${componentRef}.`,
                component: change.componentName,
            });
        }
        return entries;
    }
    generateModifiedComponentEntries(change, componentRef) {
        const entries = [];
        const details = change.changes;
        // Data attributes
        if (details.addedDataAttributes) {
            for (const attr of details.addedDataAttributes) {
                entries.push({
                    type: 'improvement',
                    category: 'data-attribute',
                    description: `Introduced \`${attr}\` attribute to ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedDataAttributes) {
            for (const attr of details.removedDataAttributes) {
                entries.push({
                    type: 'breaking',
                    category: 'data-attribute',
                    description: `Removed \`${attr}\` attribute from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Blocks
        if (details.addedBlocks) {
            for (const block of details.addedBlocks) {
                entries.push({
                    type: 'improvement',
                    category: 'block',
                    description: `Introduced \`${block}\` block to ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedBlocks) {
            for (const block of details.removedBlocks) {
                entries.push({
                    type: 'breaking',
                    category: 'block',
                    description: `Removed \`${block}\` block from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Macros
        if (details.addedMacros) {
            for (const macro of details.addedMacros) {
                entries.push({
                    type: 'improvement',
                    category: 'macro',
                    description: `Introduced \`${macro}\` macro to ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedMacros) {
            for (const macro of details.removedMacros) {
                entries.push({
                    type: 'breaking',
                    category: 'macro',
                    description: `Removed \`${macro}\` macro from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Define data variables
        if (details.addedDefineDataVariables) {
            for (const variable of details.addedDefineDataVariables) {
                entries.push({
                    type: 'improvement',
                    category: 'variable',
                    description: `Introduced \`${variable}\` variable to ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedDefineDataVariables) {
            for (const variable of details.removedDefineDataVariables) {
                entries.push({
                    type: 'breaking',
                    category: 'variable',
                    description: `Removed \`${variable}\` variable from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Attributes keys
        if (details.addedAttributesKeys) {
            for (const key of details.addedAttributesKeys) {
                entries.push({
                    type: 'improvement',
                    category: 'attribute',
                    description: `Introduced \`${key}\` attribute to ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedAttributesKeys) {
            for (const key of details.removedAttributesKeys) {
                entries.push({
                    type: 'breaking',
                    category: 'attribute',
                    description: `Removed \`${key}\` attribute from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Molecules
        if (details.addedMolecules) {
            for (const molecule of details.addedMolecules) {
                entries.push({
                    type: 'improvement',
                    category: 'molecule',
                    description: `Introduced \`${molecule}\` molecule usage in ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedMolecules) {
            for (const molecule of details.removedMolecules) {
                entries.push({
                    type: 'breaking',
                    category: 'molecule',
                    description: `Removed \`${molecule}\` molecule usage from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Widgets
        if (details.addedWidgets) {
            for (const widget of details.addedWidgets) {
                entries.push({
                    type: 'improvement',
                    category: 'widget',
                    description: `Introduced \`${widget}\` widget to ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedWidgets) {
            for (const widget of details.removedWidgets) {
                entries.push({
                    type: 'breaking',
                    category: 'widget',
                    description: `Removed \`${widget}\` widget from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Methods
        if (details.addedMethods) {
            for (const method of details.addedMethods) {
                entries.push({
                    type: 'improvement',
                    category: 'method',
                    description: `Introduced \`${method.name}()\` method to ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedMethods) {
            for (const method of details.removedMethods) {
                entries.push({
                    type: 'breaking',
                    category: 'method',
                    description: `Removed \`${method.name}()\` method from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Visibility changes
        if (details.visibilityChanges) {
            for (const change of details.visibilityChanges) {
                if (change.from === 'public' && (change.to === 'protected' || change.to === 'private')) {
                    entries.push({
                        type: 'breaking',
                        category: 'visibility',
                        description: `Changed \`${change.name}()\` method to ${change.to} in ${componentRef}.`,
                        component: change.name,
                    });
                }
                else if ((change.from === 'protected' || change.from === 'private') && change.to === 'public') {
                    entries.push({
                        type: 'improvement',
                        category: 'visibility',
                        description: `Changed \`${change.name}()\` method to public in ${componentRef}.`,
                        component: change.name,
                    });
                }
            }
        }
        // Events
        if (details.addedEvents) {
            for (const event of details.addedEvents) {
                entries.push({
                    type: 'improvement',
                    category: 'event',
                    description: `Introduced \`${event}\` event to ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedEvents) {
            for (const event of details.removedEvents) {
                entries.push({
                    type: 'breaking',
                    category: 'event',
                    description: `Removed \`${event}\` event from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Mixins
        if (details.addedMixins) {
            for (const mixin of details.addedMixins) {
                entries.push({
                    type: 'improvement',
                    category: 'mixin',
                    description: `Introduced \`${mixin}\` mixin to ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedMixins) {
            for (const mixin of details.removedMixins) {
                entries.push({
                    type: 'breaking',
                    category: 'mixin',
                    description: `Removed \`${mixin}\` mixin from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Variables
        if (details.addedVariables || details.addedCssVariables) {
            const allVars = [...(details.addedVariables || []), ...(details.addedCssVariables || [])];
            for (const variable of allVars) {
                entries.push({
                    type: 'improvement',
                    category: 'variable',
                    description: `Introduced \`${variable}\` global SASS variable.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedVariables || details.removedCssVariables) {
            const allVars = [...(details.removedVariables || []), ...(details.removedCssVariables || [])];
            for (const variable of allVars) {
                entries.push({
                    type: 'breaking',
                    category: 'variable',
                    description: `Removed \`${variable}\` global SASS variable.`,
                    component: change.componentName,
                });
            }
        }
        // Modifiers
        if (details.addedModifiers) {
            for (const modifier of details.addedModifiers) {
                entries.push({
                    type: 'improvement',
                    category: 'modifier',
                    description: `Introduced \`${modifier}\` modifier to ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedModifiers) {
            for (const modifier of details.removedModifiers) {
                entries.push({
                    type: 'breaking',
                    category: 'modifier',
                    description: `Removed \`${modifier}\` modifier from ${componentRef}.`,
                    component: change.componentName,
                });
            }
        }
        // Classes
        if (details.addedClasses) {
            for (const cls of details.addedClasses) {
                entries.push({
                    type: 'improvement',
                    category: 'class',
                    description: `Introduced \`${cls}\` global CSS class.`,
                    component: change.componentName,
                });
            }
        }
        if (details.removedClasses) {
            for (const cls of details.removedClasses) {
                entries.push({
                    type: 'breaking',
                    category: 'class',
                    description: `Removed \`${cls}\` global CSS class.`,
                    component: change.componentName,
                });
            }
        }
        return entries;
    }
    formatComponentReference(name, type) {
        if (type === 'atom')
            return `\`${name}\` atom`;
        if (type === 'molecule')
            return `\`${name}\` molecule`;
        if (type === 'organism')
            return `\`${name}\` organism`;
        if (type === 'template')
            return `\`${name}\` template`;
        if (type === 'page')
            return `\`${name}\` page`;
        return `\`${name}\``;
    }
}
exports.FrontendChangelogGenerator = FrontendChangelogGenerator;
//# sourceMappingURL=frontend-changelog-generator.js.map