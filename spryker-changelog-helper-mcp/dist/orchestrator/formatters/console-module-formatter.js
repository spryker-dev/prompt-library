"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleModuleFormatter = void 0;
const text_builder_1 = require("./utils/text-builder");
const console_template_1 = require("./templates/console-template");
const display_config_1 = require("./config/display-config");
class ConsoleModuleFormatter {
    format(moduleReports) {
        if (moduleReports.size === 0) {
            return;
        }
        console.log(this.buildOutput(moduleReports));
    }
    buildOutput(moduleReports) {
        const builder = new text_builder_1.TextBuilder();
        builder.add(console_template_1.ConsoleTemplate.section(`📦 Module Reports (${moduleReports.size} module(s) changed)`));
        builder.add('');
        const sortedModules = Array.from(moduleReports.entries())
            .sort(([a], [b]) => a.localeCompare(b));
        for (const [moduleName, report] of sortedModules) {
            builder.add(this.buildModuleSection(moduleName, report));
            builder.add('');
        }
        return builder.build();
    }
    buildModuleSection(moduleName, report) {
        const builder = new text_builder_1.TextBuilder();
        const vr = report.versionRecommendation;
        const bumpEmoji = vr.recommendedBump === 'MAJOR' ? '🔴' :
            vr.recommendedBump === 'MINOR' ? '🟡' : '🟢';
        // Module header
        builder.add(`┌─ ${moduleName} Module ${'─'.repeat(Math.max(0, 45 - moduleName.length))}`);
        builder.add(`│ 📌 Version: ${bumpEmoji} ${vr.recommendedBump} (${vr.confidence} confidence)`);
        if (vr.requiresManualReview) {
            builder.add(`│ ⚠️  Manual Review Required`);
        }
        builder.add('│');
        // Public API Changes
        const publicApi = report.publicApiChanges;
        const hasPublicChanges = publicApi.newMethods.length > 0 ||
            publicApi.modifiedMethods.length > 0 ||
            publicApi.removedMethods.length > 0 ||
            publicApi.affectedByInternal.length > 0;
        if (hasPublicChanges) {
            builder.add('│ Public API Changes:');
            if (publicApi.newMethods.length > 0) {
                builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.added.emoji} New: ${publicApi.newMethods.length}`);
                for (const method of publicApi.newMethods) {
                    const shortMethod = this.shortenMethod(method.method);
                    builder.add(`│     - ${shortMethod}`);
                }
            }
            if (publicApi.modifiedMethods.length > 0) {
                builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.modified.emoji} Modified (signature): ${publicApi.modifiedMethods.length}`);
                for (const method of publicApi.modifiedMethods) {
                    const shortMethod = this.shortenMethod(method.method);
                    builder.add(`│     - ${shortMethod}`);
                }
            }
            if (publicApi.removedMethods.length > 0) {
                builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.removed.emoji} Removed: ${publicApi.removedMethods.length}`);
                for (const method of publicApi.removedMethods) {
                    const shortMethod = this.shortenMethod(method.method);
                    builder.add(`│     - ${shortMethod}`);
                }
            }
            if (publicApi.affectedByInternal.length > 0) {
                builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.modified.emoji} Affected by internal: ${publicApi.affectedByInternal.length}`);
                for (const affected of publicApi.affectedByInternal) {
                    const shortMethod = this.shortenMethod(affected.method);
                    const affectedCount = affected.affectedBy.length;
                    builder.add(`│     - ${shortMethod} (${affectedCount} internal change${affectedCount > 1 ? 's' : ''})`);
                }
            }
            builder.add('│');
        }
        else {
            builder.add('│ Public API Changes: None');
            builder.add('│');
        }
        // Internal Changes
        const internal = report.internalChanges;
        const hasInternalChanges = internal.newMethods.length > 0 ||
            internal.modifiedMethods.length > 0 ||
            internal.modifiedFiles.length > 0;
        if (hasInternalChanges) {
            builder.add('│ Internal Changes:');
            if (internal.newMethods.length > 0) {
                builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.added.emoji} New methods: ${internal.newMethods.length}`);
            }
            if (internal.modifiedMethods.length > 0) {
                const signatureChanges = internal.modifiedMethods.filter(m => m.signatureChanged).length;
                builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.modified.emoji} Modified methods: ${internal.modifiedMethods.length} (${signatureChanges} signature)`);
            }
            if (internal.modifiedFiles.length > 0) {
                builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.modified.emoji} Modified files: ${internal.modifiedFiles.length}`);
            }
            builder.add('│');
        }
        else {
            builder.add('│ Internal Changes: None');
            builder.add('│');
        }
        // Data Changes
        const data = report.dataChanges;
        const hasDataChanges = data.transfers.length > 0 || data.schemas.length > 0;
        if (hasDataChanges) {
            builder.add('│ Data Changes:');
            if (data.transfers.length > 0) {
                const newTransfers = data.transfers.filter(t => t.changeType === 'new').length;
                const modifiedTransfers = data.transfers.filter(t => t.changeType === 'modified').length;
                const removedTransfers = data.transfers.filter(t => t.changeType === 'removed').length;
                if (newTransfers > 0) {
                    builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.added.emoji} New transfers: ${newTransfers}`);
                }
                if (modifiedTransfers > 0) {
                    builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.modified.emoji} Modified transfers: ${modifiedTransfers}`);
                }
                if (removedTransfers > 0) {
                    builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.removed.emoji} Removed transfers: ${removedTransfers}`);
                }
            }
            if (data.schemas.length > 0) {
                const newTables = data.schemas.filter(s => s.changeType === 'new').length;
                const modifiedTables = data.schemas.filter(s => s.changeType === 'modified').length;
                const removedTables = data.schemas.filter(s => s.changeType === 'removed').length;
                if (newTables > 0) {
                    builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.added.emoji} New tables: ${newTables}`);
                }
                if (modifiedTables > 0) {
                    const addedColumns = data.schemas.reduce((sum, s) => sum + (s.addedColumns?.length || 0), 0);
                    const removedColumns = data.schemas.reduce((sum, s) => sum + (s.removedColumns?.length || 0), 0);
                    builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.modified.emoji} Modified tables: ${modifiedTables} (+${addedColumns} cols, -${removedColumns} cols)`);
                }
                if (removedTables > 0) {
                    builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.removed.emoji} Removed tables: ${removedTables}`);
                }
            }
            builder.add('│');
        }
        else {
            builder.add('│ Data Changes: None');
            builder.add('│');
        }
        // Composer Changes
        if (report.composerChanges) {
            builder.add('│ Composer Changes:');
            const composer = report.composerChanges;
            if (composer.phpVersionChange) {
                const php = composer.phpVersionChange;
                builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.modified.emoji} PHP: ${php.old || 'none'} → ${php.new || 'none'} (${php.changeType})`);
            }
            if (composer.dependencyChanges.length > 0) {
                const added = composer.dependencyChanges.filter(d => d.changeType === 'added').length;
                const removed = composer.dependencyChanges.filter(d => d.changeType === 'removed').length;
                const modified = composer.dependencyChanges.filter(d => d.changeType === 'modified').length;
                if (added > 0)
                    builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.added.emoji} Dependencies added: ${added}`);
                if (removed > 0)
                    builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.removed.emoji} Dependencies removed: ${removed}`);
                if (modified > 0)
                    builder.add(`│   ${display_config_1.DisplayConfig.changeTypes.modified.emoji} Dependencies modified: ${modified}`);
            }
            builder.add('│');
        }
        // Validation Notes
        if (vr.notes.length > 0) {
            builder.add('│ Notes:');
            for (const note of vr.notes) {
                const wrapped = this.wrapText(note, 60);
                for (const line of wrapped) {
                    builder.add(`│   - ${line}`);
                }
            }
        }
        builder.add('└' + '─'.repeat(50));
        return builder.build();
    }
    shortenMethod(fqcn) {
        // Extract class and method name
        const parts = fqcn.split('::');
        if (parts.length !== 2)
            return fqcn;
        const className = parts[0].split('\\').pop() || parts[0];
        const methodName = parts[1];
        return `${className}::${methodName}()`;
    }
    wrapText(text, maxLength) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        for (const word of words) {
            if ((currentLine + ' ' + word).length <= maxLength) {
                currentLine = currentLine ? currentLine + ' ' + word : word;
            }
            else {
                if (currentLine)
                    lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine)
            lines.push(currentLine);
        return lines;
    }
}
exports.ConsoleModuleFormatter = ConsoleModuleFormatter;
//# sourceMappingURL=console-module-formatter.js.map