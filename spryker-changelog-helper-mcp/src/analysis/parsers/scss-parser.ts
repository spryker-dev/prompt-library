export class ScssParser {
  parse(content: string): ScssFeatures {
    return {
      variables: this.extractVariables(content),
      cssVariables: this.extractCssVariables(content),
      mixins: this.extractMixins(content),
      classes: this.extractClasses(content),
      modifiers: this.extractModifiers(content),
    };
  }

  private extractVariables(content: string): string[] {
    const variables: string[] = [];
    const pattern = /\$([\w-]+)\s*:/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      variables.push(`$${match[1]}`);
    }

    return [...new Set(variables)];
  }

  private extractCssVariables(content: string): string[] {
    const variables: string[] = [];
    const pattern = /--([\w-]+)\s*:/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      variables.push(`--${match[1]}`);
    }

    return [...new Set(variables)];
  }

  private extractMixins(content: string): string[] {
    const mixins: string[] = [];
    const pattern = /@mixin\s+([\w-]+)/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      mixins.push(match[1]);
    }

    return mixins;
  }

  private extractClasses(content: string): string[] {
    const classes: string[] = [];
    const pattern = /\.([\w-]+)(?:\s|{|,|:)/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      const className = match[1];
      // Skip modifiers (they have their own extraction)
      if (!className.includes('&') && !content.includes(`&--${className}`)) {
        classes.push(`.${className}`);
      }
    }

    return [...new Set(classes)];
  }

  private extractModifiers(content: string): string[] {
    const modifiers: string[] = [];
    const pattern = /&--([\w-]+)/g;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      modifiers.push(`--${match[1]}`);
    }

    return modifiers;
  }
}

export interface ScssFeatures {
  variables: string[];
  cssVariables: string[];
  mixins: string[];
  classes: string[];
  modifiers: string[];
}
