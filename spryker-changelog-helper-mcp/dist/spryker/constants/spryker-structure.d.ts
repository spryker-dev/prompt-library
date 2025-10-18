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
export type SprykerVendorType = typeof SprykerVendor[keyof typeof SprykerVendor];
export type SprykerLayerType = typeof SprykerLayer[keyof typeof SprykerLayer];
//# sourceMappingURL=spryker-structure.d.ts.map