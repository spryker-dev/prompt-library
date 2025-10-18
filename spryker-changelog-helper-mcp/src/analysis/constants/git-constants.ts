export const GitStatus = {
  ADDED: 'A',
  DELETED: 'D',
  MODIFIED: 'M',
  RENAMED: 'R',
  COPIED: 'C',
} as const;

export const DiffMarkers = {
  NEW_FILE: 'new file mode',
  DELETED_FILE: 'deleted file mode',
  BLOCK_MARKER: '@@',
  OR_OPERATOR: '||',
} as const;

export const DiffPrefixes = {
  ADDITION: '+',
  REMOVAL: '-',
  ADDITION_FILE: '+++',
  REMOVAL_FILE: '---',
  CONTEXT: ' ',
} as const;

export const DiffSettings = {
  CONTEXT_LINES: 10,
} as const;
