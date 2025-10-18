"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionRecommender = void 0;
const version_constants_1 = require("../constants/version-constants");
const file_constants_1 = require("../../analysis/constants/file-constants");
const change_constants_1 = require("../../analysis/constants/change-constants");
const spryker_constants_1 = require("../../spryker/constants/spryker-constants");
class VersionRecommender {
    recommend(report) {
        const reasons = [];
        let requiresManualReview = false;
        const notes = [];
        // MAJOR: Breaking changes
        if (report.modifiedPublicAPI.length > 0) {
            reasons.push({
                type: 'MAJOR',
                category: 'Modified Public API',
                description: 'Public API method signatures changed (breaking)',
                count: report.modifiedPublicAPI.length,
            });
        }
        if (report.removedMethods.length > 0) {
            const publicRemovals = report.removedMethods.filter(m => spryker_constants_1.PublicApiClassSuffixes.some((suffix) => m.fqcn.includes(suffix)));
            if (publicRemovals.length > 0) {
                reasons.push({
                    type: 'MAJOR',
                    category: 'Removed Public API',
                    description: 'Public API methods removed',
                    count: publicRemovals.length,
                });
            }
        }
        // Check for removed database columns/tables
        const removedSchemaChanges = report.schemaChanges.filter(s => s.changeType === change_constants_1.ChangeType.REMOVED ||
            (s.removedColumns && s.removedColumns.length > 0) ||
            (s.removedIndexes && s.removedIndexes.length > 0));
        if (removedSchemaChanges.length > 0) {
            const removedColumns = removedSchemaChanges.reduce((sum, s) => sum + (s.removedColumns?.length || 0), 0);
            if (removedColumns > 0 || removedSchemaChanges.some(s => s.changeType === change_constants_1.ChangeType.REMOVED)) {
                reasons.push({
                    type: 'MAJOR',
                    category: 'Database Breaking Changes',
                    description: 'Database columns/tables removed',
                    count: removedColumns + removedSchemaChanges.filter(s => s.changeType === change_constants_1.ChangeType.REMOVED).length,
                });
            }
        }
        // Check for removed transfers
        const removedTransfers = report.transferChanges.filter(t => t.changeType === change_constants_1.ChangeType.REMOVED ||
            (t.removedProperties && t.removedProperties.length > 0));
        if (removedTransfers.length > 0) {
            const removedProps = removedTransfers.reduce((sum, t) => sum + (t.removedProperties?.length || 0), 0);
            reasons.push({
                type: 'MAJOR',
                category: 'Transfer Breaking Changes',
                description: 'Transfer objects/properties removed',
                count: removedProps + removedTransfers.filter(t => t.changeType === change_constants_1.ChangeType.REMOVED).length,
            });
        }
        // Check for modified config methods (breaking if signature changed)
        if (report.modifiedConfigMethods.length > 0) {
            const breakingConfigChanges = report.modifiedConfigMethods.filter(m => m.signatureChanged);
            if (breakingConfigChanges.length > 0) {
                reasons.push({
                    type: 'MAJOR',
                    category: 'Configuration Breaking Changes',
                    description: 'Configuration method signatures changed',
                    count: breakingConfigChanges.length,
                });
            }
        }
        // Check for removed constants (breaking change)
        const removedConstants = report.constantChanges.filter(c => c.removedConstants && c.removedConstants.length > 0);
        if (removedConstants.length > 0) {
            const totalRemoved = removedConstants.reduce((sum, c) => sum + (c.removedConstants?.length || 0), 0);
            reasons.push({
                type: 'MAJOR',
                category: 'Constant Breaking Changes',
                description: 'Constants removed',
                count: totalRemoved,
            });
        }
        // MINOR: New features
        if (report.newPublicAPI.length > 0) {
            reasons.push({
                type: 'MINOR',
                category: 'New Public API',
                description: 'New public API methods added',
                count: report.newPublicAPI.length,
            });
        }
        if (report.newConfigMethods.length > 0) {
            reasons.push({
                type: 'MINOR',
                category: 'New Configuration',
                description: 'New configuration methods added',
                count: report.newConfigMethods.length,
            });
        }
        if (report.newClasses.length > 0) {
            reasons.push({
                type: 'MINOR',
                category: 'New Classes',
                description: 'New classes added',
                count: report.newClasses.length,
            });
        }
        // New database columns/tables
        const newSchemaChanges = report.schemaChanges.filter(s => s.changeType === change_constants_1.ChangeType.NEW ||
            (s.addedColumns && s.addedColumns.length > 0) ||
            (s.addedIndexes && s.addedIndexes.length > 0));
        if (newSchemaChanges.length > 0) {
            const addedColumns = newSchemaChanges.reduce((sum, s) => sum + (s.addedColumns?.length || 0), 0);
            reasons.push({
                type: 'MINOR',
                category: 'Database Enhancements',
                description: 'New database columns/tables added',
                count: addedColumns + newSchemaChanges.filter(s => s.changeType === change_constants_1.ChangeType.NEW).length,
            });
        }
        // New transfers
        const newTransfers = report.transferChanges.filter(t => t.changeType === change_constants_1.ChangeType.NEW ||
            (t.addedProperties && t.addedProperties.length > 0));
        if (newTransfers.length > 0) {
            const addedProps = newTransfers.reduce((sum, t) => sum + (t.addedProperties?.length || 0), 0);
            reasons.push({
                type: 'MINOR',
                category: 'Transfer Enhancements',
                description: 'New transfer objects/properties added',
                count: addedProps + newTransfers.filter(t => t.changeType === change_constants_1.ChangeType.NEW).length,
            });
        }
        // New plugin methods (including protected) - these add new functionality
        const newPluginMethods = report.newMethods?.filter(m => {
            const className = m.fqcn.split('::')[0];
            return className.includes('Plugin');
        }) || [];
        if (newPluginMethods.length > 0) {
            reasons.push({
                type: 'MINOR',
                category: 'New Plugin Methods',
                description: 'New methods added to plugins',
                count: newPluginMethods.length,
            });
        }
        // Internal changes with impact
        if (report.internalChangesWithImpact.length > 0) {
            reasons.push({
                type: 'MINOR',
                category: 'Internal Changes with Impact',
                description: 'Internal changes affecting public API behavior',
                count: report.internalChangesWithImpact.length,
            });
            requiresManualReview = true;
            notes.push('Internal changes may affect public API behavior - review for potential breaking changes');
        }
        // PATCH: Safe changes
        if (report.internalChangesNoImpact.length > 0 && reasons.length === 0) {
            reasons.push({
                type: 'PATCH',
                category: 'Internal Improvements',
                description: 'Internal implementation changes with no public API impact',
                count: report.internalChangesNoImpact.length,
            });
        }
        // Determine recommended bump
        const hasMajor = reasons.some(r => r.type === version_constants_1.VersionBumpType.MAJOR);
        const hasMinor = reasons.some(r => r.type === version_constants_1.VersionBumpType.MINOR);
        let recommendedBump;
        let confidence;
        if (hasMajor) {
            recommendedBump = 'MAJOR';
            confidence = requiresManualReview ? 'medium' : 'high';
        }
        else if (hasMinor) {
            recommendedBump = 'MINOR';
            confidence = requiresManualReview ? 'medium' : 'high';
        }
        else {
            recommendedBump = 'PATCH';
            confidence = reasons.length > 0 ? 'high' : 'low';
            if (reasons.length === 0) {
                notes.push('No significant changes detected - verify this is intentional');
            }
        }
        // Additional notes based on change patterns
        if (report.modifiedInternalFiles && report.modifiedInternalFiles.length > 0) {
            const signatureChanges = report.modifiedInternalFiles.filter(f => f.changeType === change_constants_1.InternalChangeType.SIGNATURE).length;
            if (signatureChanges > 0) {
                notes.push(`${signatureChanges} internal file(s) have signature changes - may indicate refactoring`);
            }
        }
        if (report.nonPhpFiles.length > 0) {
            const composerChanges = report.nonPhpFiles.filter(f => f.file.includes(file_constants_1.FilePattern.COMPOSER_JSON));
            if (composerChanges.length > 0) {
                requiresManualReview = true;
                notes.push('Composer.json changes detected - review for dependency constraint changes (may require MAJOR)');
            }
            const configChanges = report.nonPhpFiles.filter(f => f.file.includes(file_constants_1.FilePattern.CONFIG_FILE) || f.file.includes('.yml') || f.file.includes('.yaml'));
            if (configChanges.length > 0) {
                notes.push('Configuration file changes detected - review for breaking changes');
            }
        }
        return {
            recommendedBump,
            reasons,
            confidence,
            requiresManualReview,
            notes,
        };
    }
}
exports.VersionRecommender = VersionRecommender;
//# sourceMappingURL=version-recommender.js.map