export declare const SprykerVendor: {
    readonly SPRYKER: "Spryker";
    readonly SPRYKER_SHOP: "SprykerShop";
    readonly SPRYKER_FEATURE: "SprykerFeature";
};
export declare const SprykerVendors: readonly ["Spryker", "SprykerShop", "SprykerFeature"];
export declare const SprykerLayer: {
    readonly ZED: "Zed";
    readonly CLIENT: "Client";
    readonly SERVICE: "Service";
    readonly GLUE: "Glue";
    readonly YVES: "Yves";
    readonly SHARED: "Shared";
};
export declare const SprykerLayers: readonly ["Zed", "Client", "Service", "Glue", "Yves", "Shared"];
export declare const InternalApiLayer: {
    readonly BUSINESS: "Business";
    readonly COMMUNICATION: "Communication";
    readonly PERSISTENCE: "Persistence";
};
export declare const InternalApiLayers: readonly ["Business", "Communication", "Persistence"];
export declare const CommunicationLayerClass: {
    readonly CONTROLLER: "Controller";
    readonly FORM: "Form";
    readonly TABLE: "Table";
};
export declare const SprykerSeparator: {
    readonly NAMESPACE: "\\";
    readonly PATH: "/";
};
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
export interface ModulePattern {
    detect: string;
    glob: string;
}
export declare const DefaultModulePatterns: ModulePattern[];
//# sourceMappingURL=spryker-constants.d.ts.map