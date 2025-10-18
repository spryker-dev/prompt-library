export declare class DataGrouper {
    static groupByType<T extends {
        changeType: string;
    }>(items: T[]): Map<string, T[]>;
    static groupByFileType<T extends {
        fileType: string;
    }>(items: T[]): Map<string, T[]>;
    static groupByModule<T extends {
        method: string;
    }>(items: T[]): Map<string, T[]>;
    static groupByFile<T extends {
        file: string;
    }>(items: T[]): Map<string, T[]>;
}
//# sourceMappingURL=data-grouper.d.ts.map