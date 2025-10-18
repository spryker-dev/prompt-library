export const SprykerVendor = {
  SPRYKER: 'Spryker',
  SPRYKER_SHOP: 'SprykerShop',
  SPRYKER_FEATURE: 'SprykerFeature',
} as const;

export const SprykerVendors = [
  SprykerVendor.SPRYKER,
  SprykerVendor.SPRYKER_SHOP,
  SprykerVendor.SPRYKER_FEATURE,
] as const;

export const SprykerLayer = {
  ZED: 'Zed',
  CLIENT: 'Client',
  SERVICE: 'Service',
  GLUE: 'Glue',
  YVES: 'Yves',
  SHARED: 'Shared',
} as const;

export const SprykerLayers = [
  SprykerLayer.ZED,
  SprykerLayer.CLIENT,
  SprykerLayer.SERVICE,
  SprykerLayer.GLUE,
  SprykerLayer.YVES,
  SprykerLayer.SHARED,
] as const;

export const InternalApiLayer = {
  BUSINESS: 'Business',
  COMMUNICATION: 'Communication',
  PERSISTENCE: 'Persistence',
} as const;

export const InternalApiLayers = [
  InternalApiLayer.BUSINESS,
  InternalApiLayer.COMMUNICATION,
  InternalApiLayer.PERSISTENCE,
] as const;

export const CommunicationLayerClass = {
  CONTROLLER: 'Controller',
  FORM: 'Form',
  TABLE: 'Table',
} as const;

export const SprykerSeparator = {
  NAMESPACE: '\\',
  PATH: '/',
} as const;

export const PublicApiClassSuffix = {
  FACADE: 'Facade',
  CLIENT: 'Client',
  SERVICE: 'Service',
  PLUGIN: 'Plugin',
} as const;

export const PublicApiClassSuffixes = [
  PublicApiClassSuffix.FACADE,
  PublicApiClassSuffix.CLIENT,
  PublicApiClassSuffix.SERVICE,
  PublicApiClassSuffix.PLUGIN,
] as const;

export const PublicApiPattern = {
  PLUGIN: /\\Plugin\\|Plugin$/,
  SPRYKER_FILE_PATH: /src\/(Spryker(?:Shop|Feature)?)\/(Zed|Client|Service|Glue|Yves|Shared)\/([^\/]+)\/(.+)\.php$/,
} as const;

export function getEntrypointPattern(): string {
  return `(${PublicApiClassSuffixes.join('|')})$`;
}

export interface ModulePattern {
  detect: string;
  glob: string;
}

export const DefaultModulePatterns: ModulePattern[] = [
  { detect: '/Bundles/', glob: 'Bundles/{module}/src/**/*.php' },
  { detect: '/Features/', glob: 'Features/{module}/src/**/*.php' },
];
