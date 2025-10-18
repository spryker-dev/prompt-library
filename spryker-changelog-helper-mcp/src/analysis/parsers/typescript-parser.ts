export class TypescriptParser {
  parse(content: string): TypescriptFeatures {
    return {
      classes: this.extractClasses(content),
      methods: this.extractMethods(content),
      properties: this.extractProperties(content),
      events: this.extractEvents(content),
    };
  }

  private extractClasses(content: string): string[] {
    const classes: string[] = [];
    const classPattern = /(?:export\s+)?class\s+([\w]+)/g;
    let match;

    while ((match = classPattern.exec(content)) !== null) {
      classes.push(match[1]);
    }

    return classes;
  }

  private extractMethods(content: string): MethodInfo[] {
    const methods: MethodInfo[] = [];
    
    // Match public/protected/private methods
    const methodPattern = /(public|protected|private)?\s+([\w]+)\s*\([^)]*\)/g;
    let match;

    while ((match = methodPattern.exec(content)) !== null) {
      const visibility = match[1] || 'public';
      const name = match[2];
      
      // Skip constructors and common keywords
      if (name !== 'constructor' && name !== 'if' && name !== 'for' && name !== 'while') {
        methods.push({
          name,
          visibility: visibility as 'public' | 'protected' | 'private',
        });
      }
    }

    return methods;
  }

  private extractProperties(content: string): PropertyInfo[] {
    const properties: PropertyInfo[] = [];
    const propertyPattern = /(public|protected|private)?\s+([\w]+)\s*[:=]/g;
    let match;

    while ((match = propertyPattern.exec(content)) !== null) {
      const visibility = match[1] || 'public';
      const name = match[2];
      
      // Skip common keywords
      if (name !== 'const' && name !== 'let' && name !== 'var') {
        properties.push({
          name,
          visibility: visibility as 'public' | 'protected' | 'private',
        });
      }
    }

    return properties;
  }

  private extractEvents(content: string): string[] {
    const events: string[] = [];
    
    // Match dispatchEvent and trigger patterns
    const patterns = [
      /dispatchEvent\s*\(\s*new\s+(?:CustomEvent|Event)\s*\(\s*['"]([^'"]+)['"]/g,
      /trigger\s*\(\s*['"]([^'"]+)['"]/g,
      /\$\([^)]+\)\.trigger\s*\(\s*['"]([^'"]+)['"]/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        events.push(match[1]);
      }
    }

    return [...new Set(events)];
  }
}

export interface TypescriptFeatures {
  classes: string[];
  methods: MethodInfo[];
  properties: PropertyInfo[];
  events: string[];
}

export interface MethodInfo {
  name: string;
  visibility: 'public' | 'protected' | 'private';
}

export interface PropertyInfo {
  name: string;
  visibility: 'public' | 'protected' | 'private';
}
