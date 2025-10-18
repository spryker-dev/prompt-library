export const PhpDocPattern = {
  FACTORY_METHOD: /@method\s+\\?([A-Za-z_][\w\\]+)\s+get(?:BusinessFactory|Factory)\s*\(/,
  VAR_TYPE: /@var\s+([^\s*]+)/i,
} as const;

export const PhpDocMarker = {
  DOC_START: '/**',
  DOC_END: '*/',
  LINE_PREFIX: /^\s*\*\s?/,
  TAG_PREFIX: '@',
} as const;

export const MethodVisibility = {
  PUBLIC: 'public',
  PROTECTED: 'protected',
  PRIVATE: 'private',
} as const;

export type MethodVisibilityType = typeof MethodVisibility[keyof typeof MethodVisibility];
