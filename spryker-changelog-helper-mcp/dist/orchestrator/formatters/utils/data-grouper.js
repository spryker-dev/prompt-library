"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGrouper = void 0;
class DataGrouper {
    static groupByType(items) {
        const groups = new Map();
        for (const item of items) {
            const type = item.changeType;
            if (!groups.has(type)) {
                groups.set(type, []);
            }
            groups.get(type).push(item);
        }
        return groups;
    }
    static groupByFileType(items) {
        const groups = new Map();
        for (const item of items) {
            if (!groups.has(item.fileType)) {
                groups.set(item.fileType, []);
            }
            groups.get(item.fileType).push(item);
        }
        return groups;
    }
    static groupByModule(items) {
        const groups = new Map();
        for (const item of items) {
            const moduleMatch = item.method.match(/\\(Zed|Yves|Client|Glue|Service)\\([^\\]+)\\/);
            const moduleName = moduleMatch ? moduleMatch[2] : 'Unknown';
            if (!groups.has(moduleName)) {
                groups.set(moduleName, []);
            }
            groups.get(moduleName).push(item);
        }
        return groups;
    }
    static groupByFile(items) {
        const groups = new Map();
        for (const item of items) {
            if (!groups.has(item.file)) {
                groups.set(item.file, []);
            }
            groups.get(item.file).push(item);
        }
        return groups;
    }
}
exports.DataGrouper = DataGrouper;
//# sourceMappingURL=data-grouper.js.map