export declare const PublicApiClassSuffix: {
    readonly FACADE: "Facade";
    readonly CLIENT: "Client";
    readonly SERVICE: "Service";
    readonly PLUGIN: "Plugin";
};
export declare const PublicApiClassSuffixes: readonly ["Facade", "Client", "Service", "Plugin"];
export declare const PublicApiPattern: {
    readonly PLUGIN: RegExp;
    readonly SPRYKER_FILE_PATH: RegExp;
};
export declare function getEntrypointPattern(): string;
export type PublicApiClassSuffixType = typeof PublicApiClassSuffix[keyof typeof PublicApiClassSuffix];
//# sourceMappingURL=public-api.d.ts.map