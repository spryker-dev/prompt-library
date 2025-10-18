export declare const PhpDocPattern: {
    readonly FACTORY_METHOD: RegExp;
    readonly VAR_TYPE: RegExp;
};
export declare const PhpDocMarker: {
    readonly DOC_START: "/**";
    readonly DOC_END: "*/";
    readonly LINE_PREFIX: RegExp;
    readonly TAG_PREFIX: "@";
};
export declare const MethodVisibility: {
    readonly PUBLIC: "public";
    readonly PROTECTED: "protected";
    readonly PRIVATE: "private";
};
export type MethodVisibilityType = typeof MethodVisibility[keyof typeof MethodVisibility];
//# sourceMappingURL=php-doc-patterns.d.ts.map