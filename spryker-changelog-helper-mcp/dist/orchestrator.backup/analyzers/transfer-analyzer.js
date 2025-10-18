"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferAnalyzer = void 0;
const child_process_1 = require("child_process");
const fast_xml_parser_1 = require("fast-xml-parser");
const module_patterns_1 = require("../../spryker/patterns/module-patterns");
class TransferAnalyzer {
    constructor(gitHelper) {
        this.gitHelper = gitHelper;
    }
    async analyzeTransferChanges(gitStatusLines, baseCommit) {
        const transferChanges = [];
        const transferFiles = this.filterTransferFiles(gitStatusLines);
        for (const line of transferFiles) {
            const { status, file } = this.parseGitStatusLine(line);
            const changes = this.analyzeTransferFile(status, file, baseCommit);
            transferChanges.push(...changes);
        }
        return transferChanges;
    }
    filterTransferFiles(gitStatusLines) {
        return gitStatusLines.filter((line) => {
            const parts = line.split(/\s+/);
            const file = parts[1] || '';
            return module_patterns_1.AnalyzerConfig.patterns.transferSchema.test(file);
        });
    }
    parseGitStatusLine(line) {
        const parts = line.split(/\s+/);
        return { status: parts[0], file: parts[1] };
    }
    analyzeTransferFile(status, file, baseCommit) {
        if (status.startsWith(module_patterns_1.AnalyzerConfig.gitStatus.added)) {
            return this.handleAddedTransferFile(file);
        }
        if (status.startsWith(module_patterns_1.AnalyzerConfig.gitStatus.deleted)) {
            return this.handleDeletedTransferFile(file);
        }
        return this.handleModifiedTransferFile(file, baseCommit);
    }
    handleAddedTransferFile(file) {
        const transfers = this.extractTransferNamesFromFile(file);
        return transfers.map(transferName => ({
            file,
            transferName,
            changeType: module_patterns_1.AnalyzerConfig.changeTypes.new,
        }));
    }
    handleDeletedTransferFile(file) {
        return [{
                file,
                transferName: this.extractTransferNameFromPath(file),
                changeType: module_patterns_1.AnalyzerConfig.changeTypes.removed,
            }];
    }
    handleModifiedTransferFile(file, baseCommit) {
        try {
            const oldContent = this.gitHelper.getFileContent(baseCommit, file);
            const currentContent = this.gitHelper.getCurrentFileContent(file);
            return this.compareTransferXml(file, oldContent, currentContent);
        }
        catch (error) {
            return [];
        }
    }
    compareTransferXml(file, oldContent, newContent) {
        const parser = new fast_xml_parser_1.XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
        const oldData = parser.parse(oldContent);
        const newData = parser.parse(newContent);
        const oldTransfers = this.extractTransfersFromParsedXml(oldData);
        const newTransfers = this.extractTransfersFromParsedXml(newData);
        return this.compareTransfers(file, oldTransfers, newTransfers);
    }
    extractTransfersFromParsedXml(data) {
        const transfers = new Map();
        const transfersArray = data?.transfers?.transfer;
        if (!transfersArray)
            return transfers;
        const items = Array.isArray(transfersArray) ? transfersArray : [transfersArray];
        for (const transfer of items) {
            const name = transfer['@_name'];
            if (name)
                transfers.set(name, transfer);
        }
        return transfers;
    }
    compareTransfers(file, oldTransfers, newTransfers) {
        const changes = [];
        for (const [name, newTransfer] of newTransfers) {
            if (!oldTransfers.has(name)) {
                changes.push({ file, transferName: name, changeType: module_patterns_1.AnalyzerConfig.changeTypes.new });
                continue;
            }
            const oldTransfer = oldTransfers.get(name);
            const propertyChanges = this.compareTransferProperties(oldTransfer, newTransfer);
            if (propertyChanges.addedProperties.length > 0 || propertyChanges.removedProperties.length > 0) {
                changes.push({
                    file,
                    transferName: name,
                    changeType: module_patterns_1.AnalyzerConfig.changeTypes.modified,
                    addedProperties: propertyChanges.addedProperties.length > 0 ? propertyChanges.addedProperties : undefined,
                    removedProperties: propertyChanges.removedProperties.length > 0 ? propertyChanges.removedProperties : undefined,
                });
            }
        }
        for (const [name] of oldTransfers) {
            if (!newTransfers.has(name)) {
                changes.push({ file, transferName: name, changeType: module_patterns_1.AnalyzerConfig.changeTypes.removed });
            }
        }
        return changes;
    }
    compareTransferProperties(oldTransfer, newTransfer) {
        const oldProps = this.extractPropertyNames(oldTransfer);
        const newProps = this.extractPropertyNames(newTransfer);
        const addedProperties = newProps.filter(p => !oldProps.includes(p));
        const removedProperties = oldProps.filter(p => !newProps.includes(p));
        return { addedProperties, removedProperties };
    }
    extractPropertyNames(transfer) {
        const properties = transfer?.property;
        if (!properties)
            return [];
        const items = Array.isArray(properties) ? properties : [properties];
        return items.map((p) => p['@_name']).filter(Boolean);
    }
    extractTransferNamesFromFile(file) {
        try {
            const content = (0, child_process_1.execSync)(`cat "${file}"`, { encoding: 'utf-8', cwd: process.cwd() });
            const matches = content.matchAll(module_patterns_1.AnalyzerConfig.xmlPatterns.transferOpen);
            return Array.from(matches, (m) => m[1]);
        }
        catch {
            return [];
        }
    }
    extractTransferNameFromPath(file) {
        const match = file.match(/\/([^\/]+)\.transfer\.xml$/);
        return match ? match[1] : 'Unknown';
    }
}
exports.TransferAnalyzer = TransferAnalyzer;
//# sourceMappingURL=transfer-analyzer.js.map