import { AnalyzerConfig } from '../constants/analyzer-config';
import { XMLParser } from 'fast-xml-parser';
import { GitHelper } from '../../git/git-helper';
import { TransferChange } from '../diff-analyzer';
import { XmlPattern } from '../constants/php-constants';
import { ChangeType } from '../constants/change-constants';
import { GitStatus } from '../constants/git-constants';

export class TransferAnalyzer {
  constructor(private gitHelper: GitHelper) {}

  async analyzeTransferChanges(gitStatusLines: string[], baseCommit: string): Promise<TransferChange[]> {
    const transferChanges: TransferChange[] = [];
    const transferFiles = this.filterTransferFiles(gitStatusLines);

    for (const line of transferFiles) {
      const { status, file } = this.parseGitStatusLine(line);
      const changes = this.analyzeTransferFile(status, file, baseCommit);
      transferChanges.push(...changes);
    }

    return transferChanges;
  }

  private filterTransferFiles(gitStatusLines: string[]): string[] {
    return gitStatusLines.filter((line) => {
      const parts = line.split(/\s+/);
      const file = parts[1] || '';
      return AnalyzerConfig.patterns.transferSchema.test(file);
    });
  }

  private parseGitStatusLine(line: string): { status: string; file: string } {
    const parts = line.split(/\s+/);
    return { status: parts[0], file: parts[1] };
  }

  private analyzeTransferFile(status: string, file: string, baseCommit: string): TransferChange[] {
    if (status.startsWith(GitStatus.ADDED)) {
      return this.handleAddedTransferFile(file);
    }
    
    if (status.startsWith(GitStatus.DELETED)) {
      return this.handleDeletedTransferFile(file);
    }
    
    return this.handleModifiedTransferFile(file, baseCommit);
  }

  private handleAddedTransferFile(file: string): TransferChange[] {
    const transfers = this.extractTransferNamesFromFile(file);
    return transfers.map(transferName => ({
      file,
      transferName,
      changeType: ChangeType.NEW,
    }));
  }

  private handleDeletedTransferFile(file: string): TransferChange[] {
    return [{
      file,
      transferName: this.extractTransferNameFromPath(file),
      changeType: ChangeType.REMOVED,
    }];
  }

  private handleModifiedTransferFile(file: string, baseCommit: string): TransferChange[] {
    try {
      const oldContent = this.gitHelper.getFileContent(baseCommit, file);
      const currentContent = this.gitHelper.getCurrentFileContent(file);
      return this.compareTransferXml(file, oldContent, currentContent);
    } catch (error) {
      return [];
    }
  }

  private compareTransferXml(file: string, oldContent: string, newContent: string): TransferChange[] {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const oldData = parser.parse(oldContent);
    const newData = parser.parse(newContent);
    
    const oldTransfers = this.extractTransfersFromParsedXml(oldData);
    const newTransfers = this.extractTransfersFromParsedXml(newData);
    
    return this.compareTransfers(file, oldTransfers, newTransfers);
  }

  private extractTransfersFromParsedXml(data: any): Map<string, any> {
    const transfers = new Map<string, any>();
    const transfersArray = data?.transfers?.transfer;
    
    if (!transfersArray) return transfers;
    
    const items = Array.isArray(transfersArray) ? transfersArray : [transfersArray];
    for (const transfer of items) {
      const name = transfer['@_name'];
      if (name) transfers.set(name, transfer);
    }
    
    return transfers;
  }

  private compareTransfers(file: string, oldTransfers: Map<string, any>, newTransfers: Map<string, any>): TransferChange[] {
    const changes: TransferChange[] = [];
    
    for (const [name, newTransfer] of newTransfers) {
      if (!oldTransfers.has(name)) {
        changes.push({ file, transferName: name, changeType: ChangeType.NEW });
        continue;
      }
      
      const oldTransfer = oldTransfers.get(name);
      const propertyChanges = this.compareTransferProperties(oldTransfer, newTransfer);
      
      if (propertyChanges.addedProperties.length > 0 || propertyChanges.removedProperties.length > 0) {
        changes.push({
          file,
          transferName: name,
          changeType: ChangeType.MODIFIED,
          addedProperties: propertyChanges.addedProperties.length > 0 ? propertyChanges.addedProperties : undefined,
          removedProperties: propertyChanges.removedProperties.length > 0 ? propertyChanges.removedProperties : undefined,
        });
      }
    }
    
    for (const [name] of oldTransfers) {
      if (!newTransfers.has(name)) {
        changes.push({ file, transferName: name, changeType: ChangeType.REMOVED });
      }
    }
    
    return changes;
  }

  private compareTransferProperties(oldTransfer: any, newTransfer: any): { addedProperties: string[]; removedProperties: string[] } {
    const oldProps = this.extractPropertyNames(oldTransfer);
    const newProps = this.extractPropertyNames(newTransfer);
    
    const addedProperties = newProps.filter(p => !oldProps.includes(p));
    const removedProperties = oldProps.filter(p => !newProps.includes(p));
    
    return { addedProperties, removedProperties };
  }

  private extractPropertyNames(transfer: any): string[] {
    const properties = transfer?.property;
    if (!properties) return [];
    
    const items = Array.isArray(properties) ? properties : [properties];
    return items.map((p: any) => p['@_name']).filter(Boolean);
  }



  private extractTransferNamesFromFile(file: string): string[] {
    try {
      const content = this.gitHelper.getCurrentFileContent(file);
      const matches = content.matchAll(XmlPattern.TRANSFER_OPEN);
      return Array.from(matches, (m: RegExpMatchArray) => m[1]);
    } catch {
      return [];
    }
  }

  private extractTransferNameFromPath(file: string): string {
    const match = file.match(/\/([^\/]+)\.transfer\.xml$/);
    return match ? match[1] : 'Unknown';
  }
}
