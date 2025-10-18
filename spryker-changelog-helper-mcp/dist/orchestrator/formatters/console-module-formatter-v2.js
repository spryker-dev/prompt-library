"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleModuleFormatterV2 = void 0;
const text_config_1 = require("./config/text-config");
class ConsoleModuleFormatterV2 {
    constructor() {
        this.indent = '  ';
    }
    format(moduleReports) {
        if (moduleReports.size === 0) {
            return;
        }
        const lines = [];
        lines.push(`${text_config_1.TextConfig.moduleReport.header} (${moduleReports.size} modules changed)`);
        lines.push('');
        const sortedModules = Array.from(moduleReports.entries())
            .sort(([a], [b]) => a.localeCompare(b));
        for (const [moduleName, report] of sortedModules) {
            lines.push(...this.formatModule(moduleName, report));
            lines.push('');
        }
        console.log(lines.join('\n'));
    }
    formatModule(moduleName, report) {
        const lines = [];
        const vr = report.versionRecommendation;
        // Module header
        lines.push(`${moduleName}:`);
        lines.push(`${this.indent}${text_config_1.TextConfig.moduleReport.versionLabel}: ${vr.recommendedBump} (${vr.confidence})`);
        if (vr.requiresManualReview) {
            lines.push(`${this.indent}${text_config_1.TextConfig.moduleReport.manualReview}: yes`);
        }
        // Public API (Facade/Client/Service)
        const publicLines = this.formatPublicApi(report.publicApiChanges);
        if (publicLines.length > 0) {
            lines.push(`${this.indent}${text_config_1.TextConfig.moduleReport.sections.publicApi}:`);
            lines.push(...publicLines);
        }
        // Plugins
        if (report.pluginChanges) {
            const pluginLines = this.formatPlugins(report.pluginChanges);
            if (pluginLines.length > 0) {
                lines.push(`${this.indent}${text_config_1.TextConfig.moduleReport.sections.plugins}:`);
                lines.push(...pluginLines);
            }
        }
        // Config
        if (report.configChanges) {
            const configLines = this.formatConfig(report.configChanges);
            if (configLines.length > 0) {
                lines.push(`${this.indent}${text_config_1.TextConfig.moduleReport.sections.config}:`);
                lines.push(...configLines);
            }
        }
        // Data changes
        const dataLines = this.formatData(report.dataChanges);
        if (dataLines.length > 0) {
            lines.push(`${this.indent}${text_config_1.TextConfig.moduleReport.sections.data}:`);
            lines.push(...dataLines);
        }
        // Composer changes
        if (report.composerChanges) {
            const composerLines = this.formatComposer(report.composerChanges);
            if (composerLines.length > 0) {
                lines.push(`${this.indent}${text_config_1.TextConfig.moduleReport.sections.composer}:`);
                lines.push(...composerLines);
            }
        }
        return lines;
    }
    formatPublicApi(changes) {
        const lines = [];
        const indent2 = this.indent.repeat(2);
        if (changes.newMethods.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.new}: ${changes.newMethods.length}`);
            for (const m of changes.newMethods) {
                lines.push(`${indent2}- ${this.shortenMethod(m.method)}`);
            }
        }
        if (changes.modifiedMethods.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.modified}: ${changes.modifiedMethods.length}`);
            for (const m of changes.modifiedMethods) {
                const sig = m.signatureChanged ? ` (${text_config_1.TextConfig.moduleReport.changeTypes.signatureChanged})` : '';
                lines.push(`${indent2}- ${this.shortenMethod(m.method)}${sig}`);
            }
        }
        if (changes.removedMethods.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.removed}: ${changes.removedMethods.length}`);
            for (const m of changes.removedMethods) {
                lines.push(`${indent2}- ${this.shortenMethod(m.method)}`);
            }
        }
        if (changes.affectedByInternal.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.affectedByInternal}: ${changes.affectedByInternal.length}`);
            for (const a of changes.affectedByInternal) {
                const count = a.affectedBy.length;
                lines.push(`${indent2}- ${this.shortenMethod(a.method)} (${count} internal changes)`);
            }
        }
        return lines;
    }
    formatPlugins(changes) {
        const lines = [];
        const indent2 = this.indent.repeat(2);
        if (changes.newPlugins.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.new}: ${changes.newPlugins.length}`);
            for (const m of changes.newPlugins) {
                lines.push(`${indent2}- ${this.shortenMethod(m.method)}`);
            }
        }
        if (changes.modifiedPlugins.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.modified}: ${changes.modifiedPlugins.length}`);
            for (const m of changes.modifiedPlugins) {
                const sig = m.signatureChanged ? ` (${text_config_1.TextConfig.moduleReport.changeTypes.signatureChanged})` : '';
                lines.push(`${indent2}- ${this.shortenMethod(m.method)}${sig}`);
            }
        }
        if (changes.removedPlugins.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.removed}: ${changes.removedPlugins.length}`);
            for (const m of changes.removedPlugins) {
                lines.push(`${indent2}- ${this.shortenMethod(m.method)}`);
            }
        }
        if (changes.affectedByInternal.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.affectedByInternal}: ${changes.affectedByInternal.length}`);
            for (const a of changes.affectedByInternal) {
                const count = a.affectedBy.length;
                lines.push(`${indent2}- ${this.shortenMethod(a.method)} (${count} internal changes)`);
            }
        }
        return lines;
    }
    formatConfig(changes) {
        const lines = [];
        const indent2 = this.indent.repeat(2);
        if (changes.newMethods.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.new}: ${changes.newMethods.length}`);
            for (const m of changes.newMethods) {
                lines.push(`${indent2}- ${this.shortenMethod(m.method)}`);
            }
        }
        if (changes.modifiedMethods.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.modified}: ${changes.modifiedMethods.length}`);
            for (const m of changes.modifiedMethods) {
                const sig = m.signatureChanged ? ` (${text_config_1.TextConfig.moduleReport.changeTypes.signatureChanged})` : '';
                lines.push(`${indent2}- ${this.shortenMethod(m.method)}${sig}`);
            }
        }
        if (changes.removedMethods.length > 0) {
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.changeTypes.removed}: ${changes.removedMethods.length}`);
            for (const m of changes.removedMethods) {
                lines.push(`${indent2}- ${this.shortenMethod(m.method)}`);
            }
        }
        return lines;
    }
    formatData(changes) {
        const lines = [];
        const indent2 = this.indent.repeat(2);
        // Transfers
        if (changes.transfers.length > 0) {
            const newCount = changes.transfers.filter((t) => t.changeType === 'new').length;
            const modCount = changes.transfers.filter((t) => t.changeType === 'modified').length;
            const remCount = changes.transfers.filter((t) => t.changeType === 'removed').length;
            if (newCount > 0) {
                lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.dataTypes.transfers} ${text_config_1.TextConfig.moduleReport.changeTypes.new}: ${newCount}`);
            }
            if (modCount > 0) {
                lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.dataTypes.transfers} ${text_config_1.TextConfig.moduleReport.changeTypes.modified}: ${modCount}`);
            }
            if (remCount > 0) {
                lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.dataTypes.transfers} ${text_config_1.TextConfig.moduleReport.changeTypes.removed}: ${remCount}`);
            }
        }
        // Schemas
        if (changes.schemas.length > 0) {
            const newTables = changes.schemas.filter((s) => s.changeType === 'new').length;
            const modTables = changes.schemas.filter((s) => s.changeType === 'modified').length;
            const remTables = changes.schemas.filter((s) => s.changeType === 'removed').length;
            const addedCols = changes.schemas.reduce((sum, s) => sum + (s.addedColumns?.length || 0), 0);
            const removedCols = changes.schemas.reduce((sum, s) => sum + (s.removedColumns?.length || 0), 0);
            if (newTables > 0) {
                lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.dataTypes.schemas} ${text_config_1.TextConfig.moduleReport.changeTypes.new}: ${newTables} ${text_config_1.TextConfig.moduleReport.dataTypes.tables}`);
            }
            if (modTables > 0) {
                lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.dataTypes.schemas} ${text_config_1.TextConfig.moduleReport.changeTypes.modified}: ${modTables} ${text_config_1.TextConfig.moduleReport.dataTypes.tables} (+${addedCols}/-${removedCols} ${text_config_1.TextConfig.moduleReport.dataTypes.columns})`);
            }
            if (remTables > 0) {
                lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.dataTypes.schemas} ${text_config_1.TextConfig.moduleReport.changeTypes.removed}: ${remTables} ${text_config_1.TextConfig.moduleReport.dataTypes.tables}`);
            }
        }
        return lines;
    }
    formatComposer(changes) {
        const lines = [];
        const indent2 = this.indent.repeat(2);
        if (changes.phpVersionChange) {
            const php = changes.phpVersionChange;
            const oldVer = php.old || 'none';
            const newVer = php.new || 'none';
            lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.composerTypes.phpVersion}: ${oldVer} -> ${newVer} (${php.changeType})`);
        }
        if (changes.dependencyChanges && changes.dependencyChanges.length > 0) {
            const added = changes.dependencyChanges.filter((d) => d.changeType === 'added');
            const removed = changes.dependencyChanges.filter((d) => d.changeType === 'removed');
            const modified = changes.dependencyChanges.filter((d) => d.changeType === 'modified');
            if (added.length > 0) {
                lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.composerTypes.dependencies} ${text_config_1.TextConfig.moduleReport.composerTypes.added}: ${added.length}`);
                for (const dep of added) {
                    lines.push(`${indent2}- ${dep.package}: ${dep.newConstraint}`);
                }
            }
            if (removed.length > 0) {
                lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.composerTypes.dependencies} ${text_config_1.TextConfig.moduleReport.composerTypes.removed}: ${removed.length}`);
                for (const dep of removed) {
                    lines.push(`${indent2}- ${dep.package}: ${dep.oldConstraint}`);
                }
            }
            if (modified.length > 0) {
                lines.push(`${indent2}${text_config_1.TextConfig.moduleReport.composerTypes.dependencies} ${text_config_1.TextConfig.moduleReport.composerTypes.modified}: ${modified.length}`);
                for (const dep of modified) {
                    const changeType = dep.constraintChangeType ? ` (${dep.constraintChangeType})` : '';
                    lines.push(`${indent2}- ${dep.package}: ${dep.oldConstraint} -> ${dep.newConstraint}${changeType}`);
                }
            }
        }
        return lines;
    }
    shortenMethod(fqcn) {
        const parts = fqcn.split('::');
        if (parts.length !== 2)
            return fqcn;
        const className = parts[0].split('\\').pop() || parts[0];
        const methodName = parts[1];
        return `${className}::${methodName}()`;
    }
}
exports.ConsoleModuleFormatterV2 = ConsoleModuleFormatterV2;
//# sourceMappingURL=console-module-formatter-v2.js.map