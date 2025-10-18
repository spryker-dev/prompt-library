export interface CLIOptions {
    root: string;
    globs: string[];
    excludes: string[];
    targets: string[];
    entrypoints: string;
    json: boolean;
    changelog: boolean;
    debug: boolean;
    noInterfaces: boolean;
    log?: string;
    diff?: string;
    includeTests?: boolean;
    noOutputFiles?: boolean;
    modulePatternsFile?: string;
    modules?: string[];
}
export declare class CLIParser {
    static parse(args: string[]): CLIOptions;
    private static parseTargets;
    private static parseModules;
    private static printHelp;
}
//# sourceMappingURL=cli-parser.d.ts.map