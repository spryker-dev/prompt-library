import { GitHelper } from '../../git/git-helper';
import { TransferChange } from '../diff-analyzer';
export declare class TransferAnalyzer {
    private gitHelper;
    constructor(gitHelper: GitHelper);
    analyzeTransferChanges(gitStatusLines: string[], baseCommit: string): Promise<TransferChange[]>;
    private filterTransferFiles;
    private parseGitStatusLine;
    private analyzeTransferFile;
    private handleAddedTransferFile;
    private handleDeletedTransferFile;
    private handleModifiedTransferFile;
    private compareTransferXml;
    private extractTransfersFromParsedXml;
    private compareTransfers;
    private compareTransferProperties;
    private extractPropertyNames;
    private extractTransferNamesFromFile;
    private extractTransferNameFromPath;
}
//# sourceMappingURL=transfer-analyzer.d.ts.map