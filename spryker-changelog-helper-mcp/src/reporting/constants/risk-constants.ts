export const RiskLevel = {
  HIGH: { level: 'HIGH' as const, emoji: '🔴' },
  MEDIUM: { level: 'MEDIUM' as const, emoji: '🟡' },
  LOW: { level: 'LOW' as const, emoji: '🟢' },
} as const;

export const RiskThreshold = {
  MODIFIED_CONFIG_METHODS_HIGH: 3,
  NEW_PUBLIC_API_MEDIUM: 5,
  INTERNAL_WITH_IMPACT_MEDIUM: 10,
} as const;
