"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextBuilder = void 0;
class TextBuilder {
    constructor() {
        this.lines = [];
    }
    add(text) {
        this.lines.push(text);
        return this;
    }
    addIf(condition, text) {
        if (condition) {
            this.lines.push(text);
        }
        return this;
    }
    addSection(title, content) {
        if (content.length === 0)
            return this;
        this.lines.push(title);
        this.lines.push(...content);
        return this;
    }
    addList(items, limit) {
        const displayItems = limit ? items.slice(0, limit) : items;
        this.lines.push(...displayItems);
        if (limit && items.length > limit) {
            this.lines.push(`... and ${items.length - limit} more`);
        }
        return this;
    }
    build() {
        return this.lines.join('\n');
    }
    clear() {
        this.lines = [];
        return this;
    }
}
exports.TextBuilder = TextBuilder;
//# sourceMappingURL=text-builder.js.map