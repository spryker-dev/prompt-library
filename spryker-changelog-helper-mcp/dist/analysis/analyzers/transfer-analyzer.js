"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferAnalyzer = void 0;
const analyzer_config_1 = require("../constants/analyzer-config");
const fast_xml_parser_1 = require("fast-xml-parser");
const php_constants_1 = require("../constants/php-constants");
const change_constants_1 = require("../constants/change-constants");
const git_constants_1 = require("../constants/git-constants");
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
            return analyzer_config_1.AnalyzerConfig.patterns.transferSchema.test(file);
        });
    }
    parseGitStatusLine(line) {
        const parts = line.split(/\s+/);
        return { status: parts[0], file: parts[1] };
    }
    analyzeTransferFile(status, file, baseCommit) {
        if (status.startsWith(git_constants_1.GitStatus.ADDED)) {
            return this.handleAddedTransferFile(file);
        }
        if (status.startsWith(git_constants_1.GitStatus.DELETED)) {
            return this.handleDeletedTransferFile(file);
        }
        return this.handleModifiedTransferFile(file, baseCommit);
    }
    handleAddedTransferFile(file) {
        const transfers = this.extractTransferNamesFromFile(file);
        return transfers.map(transferName => ({
            file,
            transferName,
            changeType: change_constants_1.ChangeType.NEW,
        }));
    }
    handleDeletedTransferFile(file) {
        return [{
                file,
                transferName: this.extractTransferNameFromPath(file),
                changeType: change_constants_1.ChangeType.REMOVED,
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
                changes.push({ file, transferName: name, changeType: change_constants_1.ChangeType.NEW });
                continue;
            }
            const oldTransfer = oldTransfers.get(name);
            const propertyChanges = this.compareTransferProperties(oldTransfer, newTransfer);
            if (propertyChanges.addedProperties.length > 0 || propertyChanges.removedProperties.length > 0) {
                changes.push({
                    file,
                    transferName: name,
                    changeType: change_constants_1.ChangeType.MODIFIED,
                    addedProperties: propertyChanges.addedProperties.length > 0 ? propertyChanges.addedProperties : undefined,
                    removedProperties: propertyChanges.removedProperties.length > 0 ? propertyChanges.removedProperties : undefined,
                });
            }
        }
        for (const [name] of oldTransfers) {
            if (!newTransfers.has(name)) {
                changes.push({ file, transferName: name, changeType: change_constants_1.ChangeType.REMOVED });
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
            const content = this.gitHelper.getCurrentFileContent(file);
            const matches = content.matchAll(php_constants_1.XmlPattern.TRANSFER_OPEN);
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