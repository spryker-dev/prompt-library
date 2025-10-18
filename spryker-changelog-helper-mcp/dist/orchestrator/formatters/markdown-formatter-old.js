"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownFormatter = void 0;
class MarkdownFormatter {
    generate(report) {
        const sections = [
            this.generateHeader(report),
            this.generateExecutiveSummary(report),
            this.generateChangesOverview(report),
            this.generateNewPublicAPI(report),
            this.generateModifiedPublicAPI(report),
            this.generateNewConfigMethods(report),
            this.generateModifiedConfigMethods(report),
            this.generateInternalChangesWithImpact(report),
            this.generateSafeInternalChanges(report),
            this.generateTransferChanges(report),
            this.generateNonPhpFiles(report),
            this.generateSkippedFiles(report),
            this.generateAllNewMethods(report),
            this.generateAllModifiedMethods(report),
            this.generateDetailedCodeChanges(report),
        ];
        return sections.filter(s => s.length > 0).join('');
    }
    generateHeader(report) {
        return `# 🎯 Impact Analysis Report\n\nGenerated: ${report.timestamp}\n\n`;
    }
    generateExecutiveSummary(report) {
        return `## Executive Summary\n\n### Risk Assessment\n\n**Overall Risk Level: ${report.riskLevel.emoji} ${report.riskLevel.level}**\n\n`;
    }
    generateChangesOverview(report) {
        let md = `### Changes Overview\n\n`;
        md += `| Category | Count |\n`;
        md += `|----------|-------|\n`;
        md += `| 🆕 New Public API | ${report.summary.newPublicAPI} |\n`;
        md += `| ⚠️ Modified Public API | ${report.summary.modifiedPublicAPI} |\n`;
        md += `| ⚙️ New Config Methods | ${report.summary.newConfigMethods} |\n`;
        md += `| ⚙️ Modified Config Methods | ${report.summary.modifiedConfigMethods} |\n`;
        md += `| 🔍 Internal (with impact) | ${report.summary.internalWithImpact} |\n`;
        md += `| ✅ Internal (no impact) | ${report.summary.internalNoImpact} |\n`;
        md += `| 📦 Transfer Changes | ${report.transferChanges.length} |\n`;
        md += `| 📄 Non-PHP Files | ${report.nonPhpFiles.length} |\n\n`;
        return md;
    }
    generateNewPublicAPI(report) {
        if (report.newPublicAPI.length === 0)
            return '';
        let md = `## 🆕 New Public API\n\n`;
        md += `New Facade/Client/Service methods added (${report.summary.newPublicAPI} methods).\n\n`;
        for (const item of report.newPublicAPI) {
            md += `### ${item.method}\n\n`;
            md += `- **File**: \`${item.file}\`\n`;
            md += `- **Visibility**: ${item.visibility}\n\n`;
        }
        return md;
    }
    generateModifiedPublicAPI(report) {
        if (report.modifiedPublicAPI.length === 0)
            return '';
        let md = `## ⚠️ Modified Public API\n\n`;
        md += `Changed Facade/Client/Service methods (${report.summary.modifiedPublicAPI} methods).\n\n`;
        for (const item of report.modifiedPublicAPI) {
            md += `### ${item.method}\n\n`;
            md += `- **File**: \`${item.file}\`\n\n`;
        }
        return md;
    }
    generateNewConfigMethods(report) {
        if (report.newConfigMethods.length === 0)
            return '';
        let md = `## ⚙️ New Config Methods\n\n`;
        md += `New configuration methods (${report.summary.newConfigMethods} methods).\n\n`;
        for (const item of report.newConfigMethods) {
            const { className, methodName } = this.parseMethodSignature(item.method);
            md += `### ${className}::${methodName}()\n\n`;
            md += `- **File**: \`${item.file}\`\n`;
            md += `- **Visibility**: ${item.visibility}\n\n`;
        }
        return md;
    }
    generateModifiedConfigMethods(report) {
        if (report.modifiedConfigMethods.length === 0)
            return '';
        let md = `## ⚙️ Modified Config Methods\n\n`;
        md += `Changed configuration methods (${report.summary.modifiedConfigMethods} methods).\n\n`;
        for (const item of report.modifiedConfigMethods) {
            const { className, methodName } = this.parseMethodSignature(item.method);
            md += `### ${className}::${methodName}()\n\n`;
            md += `- **File**: \`${item.file}\`\n\n`;
        }
        return md;
    }
    generateInternalChangesWithImpact(report) {
        if (report.internalChangesWithImpact.length === 0) {
            return `## 🔍 Internal Changes Affecting Public API\n\nNo internal changes affecting public API.\n\n`;
        }
        let md = `## 🔍 Internal Changes Affecting Public API\n\n`;
        md += `Internal changes that impact Facade/Client/Service methods (${report.summary.internalWithImpact} methods).\n\n`;
        const changesByModule = this.groupByModule(report.internalChangesWithImpact);
        for (const [moduleName, changes] of changesByModule) {
            md += `### ${moduleName} Module\n\n`;
            for (const item of changes) {
                const { className, methodName } = this.parseMethodSignature(item.method);
                md += `#### ${className}::${methodName}()\n\n`;
                md += `**Affected Facade Methods:**\n\n`;
                for (const affected of item.affectedMethods) {
                    if (affected.class && affected.method) {
                        const facadeClass = affected.class.split('\\').pop() || '';
                        md += `  - \`${facadeClass}::${affected.method}()\` (${affected.hops} hops)\n`;
                    }
                }
                md += `\n`;
            }
        }
        return md;
    }
    generateSafeInternalChanges(report) {
        return `## ✅ Safe Internal Changes\n\nThese changes have no impact on public API (${report.summary.internalNoImpact} methods).\n\n`;
    }
    generateTransferChanges(report) {
        if (report.transferChanges.length === 0)
            return '';
        let md = `## 📦 Transfer Changes\n\nChanges to transfer objects (data structures).\n\n`;
        const newTransfers = report.transferChanges.filter(t => t.changeType === 'new');
        const modifiedTransfers = report.transferChanges.filter(t => t.changeType === 'modified');
        const removedTransfers = report.transferChanges.filter(t => t.changeType === 'removed');
        if (newTransfers.length > 0) {
            md += `### ➕ New Transfers (${newTransfers.length})\n\n`;
            for (const transfer of newTransfers) {
                md += `- **${transfer.transferName}**\n`;
                md += `  - File: \`${transfer.file}\`\n`;
            }
            md += `\n`;
        }
        if (modifiedTransfers.length > 0) {
            md += `### ✏️ Modified Transfers (${modifiedTransfers.length})\n\n`;
            for (const transfer of modifiedTransfers) {
                md += `#### ${transfer.transferName}\n\n`;
                md += `- **File**: \`${transfer.file}\`\n`;
                if (transfer.addedProperties && transfer.addedProperties.length > 0) {
                    md += `- **Added Properties**: ${transfer.addedProperties.map(p => `\`${p}\``).join(', ')}\n`;
                }
                if (transfer.removedProperties && transfer.removedProperties.length > 0) {
                    md += `- **Removed Properties**: ${transfer.removedProperties.map(p => `\`${p}\``).join(', ')}\n`;
                }
                md += `\n`;
            }
        }
        if (removedTransfers.length > 0) {
            md += `### ➖ Removed Transfers (${removedTransfers.length})\n\n`;
            for (const transfer of removedTransfers) {
                md += `- **${transfer.transferName}**\n`;
                md += `  - File: \`${transfer.file}\`\n`;
            }
            md += `\n`;
        }
        return md;
    }
    generateNonPhpFiles(report) {
        if (report.nonPhpFiles.length === 0)
            return '';
        let md = `## 📄 Non-PHP Files Changed\n\nConfiguration, template, and documentation files that were modified.\n\n`;
        const byType = this.groupByFileType(report.nonPhpFiles);
        for (const [fileType, files] of byType) {
            md += `### ${fileType.toUpperCase()} Files (${files.length})\n\n`;
            for (const file of files) {
                const emoji = this.getChangeEmoji(file.changeType);
                md += `- ${emoji} \`${file.file}\`\n`;
            }
            md += `\n`;
        }
        return md;
    }
    generateSkippedFiles(report) {
        if (report.skippedFiles.length === 0)
            return '';
        let md = `## ⚠️ Skipped Files\n\nThe following files could not be analyzed. Manual review may be needed.\n\n`;
        for (const skipped of report.skippedFiles) {
            md += `### ${skipped.file}\n\n**Reason**: ${skipped.reason}\n\n`;
        }
        return md;
    }
    generateAllNewMethods(report) {
        if (!report.newMethods || report.newMethods.length === 0)
            return '';
        let md = `## 📝 All New Methods (for Changelog)\n\nComplete list of all new methods added, grouped by file.\n\n`;
        const methodsByFile = this.groupMethodsByFile(report.newMethods);
        for (const [file, methods] of methodsByFile) {
            md += `### ${file}\n\n`;
            for (const method of methods) {
                md += `#### ${method.visibility} function ${method.name}(${method.params || ''})\n\n`;
                md += `- **Class**: \`${method.class}\`\n`;
                md += `- **FQCN**: \`${method.fqcn}\`\n\n`;
                if (method.addedLines && method.addedLines.length > 0) {
                    md += `**Code:**\n\n\`\`\`php\n${method.addedLines.join('\n')}\n\`\`\`\n\n`;
                }
            }
        }
        return md;
    }
    generateAllModifiedMethods(report) {
        if (!report.modifiedMethods || report.modifiedMethods.length === 0)
            return '';
        let md = `## 📝 All Modified Methods\n\nComplete list of all modified methods, grouped by file.\n\n`;
        const methodsByFile = this.groupMethodsByFile(report.modifiedMethods);
        for (const [file, methods] of methodsByFile) {
            md += `### ${file}\n\n`;
            for (const method of methods) {
                md += `#### ${method.name}()\n\n`;
                md += `- **Class**: \`${method.class}\`\n`;
                md += `- **Signature Changed**: ${method.signatureChanged ? 'Yes' : 'No'}\n\n`;
            }
        }
        return md;
    }
    generateDetailedCodeChanges(report) {
        if (report.internalChangesWithImpact.length === 0 || !report.modifiedMethods)
            return '';
        let md = `## 📋 Detailed Code Changes (Methods Affecting Public API)\n\n`;
        const changesByModule = this.groupByModule(report.internalChangesWithImpact);
        for (const [moduleName, changes] of changesByModule) {
            md += `### ${moduleName} Module\n\n`;
            for (const item of changes) {
                const methodData = report.modifiedMethods.find(m => m.fqcn === item.method);
                if (!methodData)
                    continue;
                const { className, methodName } = this.parseMethodSignature(item.method);
                md += `#### ${className}::${methodName}()\n\n`;
                if (methodData.removedLines && methodData.removedLines.length > 0) {
                    md += `**Removed:**\n\n\`\`\`diff\n${methodData.removedLines.map((l) => `- ${l}`).join('\n')}\n\`\`\`\n\n`;
                }
                if (methodData.addedLines && methodData.addedLines.length > 0) {
                    md += `**Added:**\n\n\`\`\`diff\n${methodData.addedLines.map((l) => `+ ${l}`).join('\n')}\n\`\`\`\n\n`;
                }
            }
        }
        return md;
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
    groupMethodsByFile(methods) {
        const byFile = new Map();
        for (const method of methods) {
            if (!byFile.has(method.file)) {
                byFile.set(method.file, []);
            }
            byFile.get(method.file).push(method);
        }
        return byFile;
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
exports.MarkdownFormatter = MarkdownFormatter;
//# sourceMappingURL=markdown-formatter-old.js.map