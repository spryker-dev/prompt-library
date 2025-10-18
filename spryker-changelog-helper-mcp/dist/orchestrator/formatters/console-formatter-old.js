"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleFormatter = void 0;
class ConsoleFormatter {
    format(report) {
        this.printRiskLevel(report);
        this.printSummary(report);
        this.printTransferChanges(report);
        this.printNonPhpFiles(report);
        this.printSkippedFiles(report);
        this.printConfigMethods(report);
        this.printInternalChanges(report);
    }
    printRiskLevel(report) {
        console.log(`\n📊 Risk Level: ${report.riskLevel.emoji} ${report.riskLevel.level}`);
    }
    printSummary(report) {
        console.log(`\n📋 Summary:`);
        console.log(`  - New Public API: ${report.summary.newPublicAPI}`);
        console.log(`  - Modified Public API: ${report.summary.modifiedPublicAPI}`);
        console.log(`  - New Config Methods: ${report.summary.newConfigMethods}`);
        console.log(`  - Modified Config Methods: ${report.summary.modifiedConfigMethods}`);
        console.log(`  - Internal Changes (with impact): ${report.summary.internalWithImpact}`);
        console.log(`  - Internal Changes (no impact): ${report.summary.internalNoImpact}`);
        console.log(`  - New Methods: ${report.summary.newMethods}`);
        console.log(`  - Modified Methods: ${report.summary.modifiedMethods}`);
        console.log(`  - Removed Methods: ${report.summary.removedMethods}`);
        console.log(`  - New Classes: ${report.summary.newClasses}`);
        console.log(`  - Skipped Files: ${report.skippedFiles.length}`);
        console.log(`  - Non-PHP Files Changed: ${report.nonPhpFiles.length}`);
        console.log(`  - Transfer Changes: ${report.transferChanges.length}`);
    }
    printTransferChanges(report) {
        if (report.transferChanges.length === 0)
            return;
        console.log(`\n📦 Transfer Changes:`);
        const newTransfers = report.transferChanges.filter(t => t.changeType === 'new');
        const modifiedTransfers = report.transferChanges.filter(t => t.changeType === 'modified');
        const removedTransfers = report.transferChanges.filter(t => t.changeType === 'removed');
        this.printNewTransfers(newTransfers);
        this.printModifiedTransfers(modifiedTransfers);
        this.printRemovedTransfers(removedTransfers);
    }
    printNewTransfers(transfers) {
        if (transfers.length === 0)
            return;
        console.log(`\n  ➕ New Transfers (${transfers.length}):`);
        for (const transfer of transfers.slice(0, 10)) {
            console.log(`    - ${transfer.transferName}`);
        }
        if (transfers.length > 10) {
            console.log(`    ... and ${transfers.length - 10} more`);
        }
    }
    printModifiedTransfers(transfers) {
        if (transfers.length === 0)
            return;
        console.log(`\n  ✏️  Modified Transfers (${transfers.length}):`);
        for (const transfer of transfers.slice(0, 10)) {
            console.log(`    - ${transfer.transferName}`);
            if (transfer.addedProperties && transfer.addedProperties.length > 0) {
                console.log(`      ➕ Added: ${transfer.addedProperties.join(', ')}`);
            }
            if (transfer.removedProperties && transfer.removedProperties.length > 0) {
                console.log(`      ➖ Removed: ${transfer.removedProperties.join(', ')}`);
            }
        }
        if (transfers.length > 10) {
            console.log(`    ... and ${transfers.length - 10} more`);
        }
    }
    printRemovedTransfers(transfers) {
        if (transfers.length === 0)
            return;
        console.log(`\n  ➖ Removed Transfers (${transfers.length}):`);
        for (const transfer of transfers.slice(0, 10)) {
            console.log(`    - ${transfer.transferName}`);
        }
        if (transfers.length > 10) {
            console.log(`    ... and ${transfers.length - 10} more`);
        }
    }
    printNonPhpFiles(report) {
        if (report.nonPhpFiles.length === 0)
            return;
        console.log(`\n📄 Non-PHP Files Changed:`);
        const byType = this.groupByFileType(report.nonPhpFiles);
        for (const [fileType, files] of byType) {
            console.log(`\n  ${fileType.toUpperCase()} files (${files.length}):`);
            for (const file of files.slice(0, 10)) {
                const emoji = this.getChangeEmoji(file.changeType);
                console.log(`    ${emoji} ${file.file}`);
            }
            if (files.length > 10) {
                console.log(`    ... and ${files.length - 10} more`);
            }
        }
    }
    printSkippedFiles(report) {
        if (report.skippedFiles.length === 0)
            return;
        console.log(`\n⚠️  Skipped Files (could not analyze):`);
        for (const skipped of report.skippedFiles) {
            console.log(`  - ${skipped.file}`);
            console.log(`    Reason: ${skipped.reason}`);
        }
    }
    printConfigMethods(report) {
        this.printNewConfigMethods(report);
        this.printModifiedConfigMethods(report);
    }
    printNewConfigMethods(report) {
        if (report.newConfigMethods.length === 0)
            return;
        console.log(`\n⚙️  New Config Methods:`);
        for (const item of report.newConfigMethods) {
            const { className, methodName } = this.parseMethodSignature(item.method);
            console.log(`  - ${className}::${methodName}()`);
        }
    }
    printModifiedConfigMethods(report) {
        if (report.modifiedConfigMethods.length === 0)
            return;
        console.log(`\n⚙️  Modified Config Methods:`);
        for (const item of report.modifiedConfigMethods) {
            const { className, methodName } = this.parseMethodSignature(item.method);
            console.log(`  - ${className}::${methodName}()`);
        }
    }
    printInternalChanges(report) {
        if (report.internalChangesWithImpact.length === 0)
            return;
        console.log(`\n🔍 Internal Changes Affecting Public API:`);
        const changesByModule = this.groupByModule(report.internalChangesWithImpact);
        for (const [moduleName, changes] of changesByModule) {
            console.log(`\n  📦 ${moduleName} Module:`);
            for (const item of changes) {
                const { className, methodName } = this.parseMethodSignature(item.method);
                console.log(`    • ${className}::${methodName}()`);
                if (item.affectedMethods.length > 0) {
                    console.log(`      Affects ${item.affectedMethods.length} Facade method(s):`);
                    for (const affected of item.affectedMethods.slice(0, 5)) {
                        if (affected.class && affected.method) {
                            const facadeClass = affected.class.split('\\').pop() || '';
                            console.log(`        → ${facadeClass}::${affected.method}() (${affected.hops} hops)`);
                        }
                    }
                    if (item.affectedMethods.length > 5) {
                        console.log(`        ... and ${item.affectedMethods.length - 5} more`);
                    }
                }
            }
        }
    }
    groupByFileType(files) {
        const byType = new Map();
        for (const file of files) {
            if (!byType.has(file.fileType)) {
                byType.set(file.fileType, []);
            }
            byType.get(file.fileType).push(file);
        }
        return byType;
    }
    groupByModule(changes) {
        const byModule = new Map();
        for (const item of changes) {
            const moduleMatch = item.method.match(/\\(Zed|Yves|Client|Glue|Service)\\([^\\]+)\\/);
            const moduleName = moduleMatch ? moduleMatch[2] : 'Unknown';
            if (!byModule.has(moduleName)) {
                byModule.set(moduleName, []);
            }
            byModule.get(moduleName).push(item);
        }
        return byModule;
    }
    parseMethodSignature(fqcn) {
        const className = fqcn.split('::')[0].split('\\').pop() || '';
        const methodName = fqcn.split('::')[1] || '';
        return { className, methodName };
    }
    getChangeEmoji(changeType) {
        if (changeType === 'added')
            return '➕';
        if (changeType === 'deleted')
            return '➖';
        return '✏️';
    }
}
exports.ConsoleFormatter = ConsoleFormatter;
//# sourceMappingURL=console-formatter-old.js.map