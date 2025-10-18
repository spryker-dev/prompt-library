"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffSettings = exports.DiffPrefixes = exports.DiffMarkers = exports.GitStatus = void 0;
exports.GitStatus = {
    ADDED: 'A',
    DELETED: 'D',
    MODIFIED: 'M',
    RENAMED: 'R',
    COPIED: 'C',
};
exports.DiffMarkers = {
    NEW_FILE: 'new file mode',
    DELETED_FILE: 'deleted file mode',
    BLOCK_MARKER: '@@',
    OR_OPERATOR: '||',
};
exports.DiffPrefixes = {
    ADDITION: '+',
    REMOVAL: '-',
    ADDITION_FILE: '+++',
    REMOVAL_FILE: '---',
    CONTEXT: ' ',
};
exports.DiffSettings = {
    CONTEXT_LINES: 10,
};
//# sourceMappingURL=git-constants.js.map