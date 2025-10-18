import { ImpactReport } from '../reporting/generators/impact-report-generator';
export type VersionBump = 'MAJOR' | 'MINOR' | 'PATCH';
export interface VersionRecommendation {
    recommendedBump: VersionBump;
    reasons: VersionBumpReason[];
    confidence: 'high' | 'medium' | 'low';
    requiresManualReview: boolean;
    notes: string[];
}
export interface VersionBumpReason {
    type: VersionBump;
    category: string;
    description: string;
    count: number;
}
export declare class VersionRecommender {
    recommend(report: ImpactReport): VersionRecommendation;
}
//# sourceMappingURL=version-recommender.d.ts.map