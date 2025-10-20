import { GitHelper } from '../../git/git-helper';
import { TwigParser, TwigFeatures } from '../parsers/twig-parser';
import { TypescriptParser, TypescriptFeatures, MethodInfo } from '../parsers/typescript-parser';
import { ScssParser, ScssFeatures } from '../parsers/scss-parser';

export interface FrontendChange {
  file: string;
  componentType: 'atom' | 'molecule' | 'organism' | 'template' | 'page' | 'style' | 'script' | 'unknown';
  componentName: string;
  changeType: 'added' | 'modified' | 'deleted';
  changes: FrontendChangeDetails;
}

export interface FrontendChangeDetails {
  // Twig changes
  addedDataAttributes?: string[];
  removedDataAttributes?: string[];
  addedBlocks?: string[];
  removedBlocks?: string[];
  addedIncludes?: string[];
  removedIncludes?: string[];
  addedMacros?: string[];
  removedMacros?: string[];
  addedDefineDataVariables?: string[];
  removedDefineDataVariables?: string[];
  addedAttributesKeys?: string[];
  removedAttributesKeys?: string[];
  addedMolecules?: string[];
  removedMolecules?: string[];
  addedWidgets?: string[];
  removedWidgets?: string[];

  // TypeScript/JavaScript changes
  addedMethods?: MethodInfo[];
  removedMethods?: MethodInfo[];
  addedProperties?: string[];
  removedProperties?: string[];
  addedEvents?: string[];
  removedEvents?: string[];
  visibilityChanges?: VisibilityChange[];

  // SCSS/CSS changes
  addedMixins?: string[];
  removedMixins?: string[];
  addedVariables?: string[];
  removedVariables?: string[];
  addedCssVariables?: string[];
  removedCssVariables?: string[];
  addedClasses?: string[];
  removedClasses?: string[];
  addedModifiers?: string[];
  removedModifiers?: string[];
}

export interface VisibilityChange {
  name: string;
  from: 'public' | 'protected' | 'private';
  to: 'public' | 'protected' | 'private';
}

export class FrontendAnalyzer {
  private twigParser = new TwigParser();
  private typescriptParser = new TypescriptParser();
  private scssParser = new ScssParser();

  constructor(private gitHelper: GitHelper) {}

  async analyzeFrontendChanges(files: Array<{ file: string; changeType: string }>, baseCommit: string): Promise<FrontendChange[]> {
    const changes: FrontendChange[] = [];

    for (const { file, changeType } of files) {
      if (changeType === 'added') {
        const newContent = await this.getFileContent(file, 'HEAD');
        const change = this.analyzeNewFile(file, newContent);
        if (change) changes.push(change);
      } else if (changeType === 'deleted') {
        const oldContent = await this.getFileContent(file, baseCommit);
        const change = this.analyzeDeletedFile(file, oldContent);
        if (change) changes.push(change);
      } else if (changeType === 'modified') {
        const oldContent = await this.getFileContent(file, baseCommit);
        const newContent = await this.getFileContent(file, 'HEAD');
        const change = this.analyzeModifiedFile(file, oldContent, newContent);
        if (change) changes.push(change);
      }
    }

    return changes;
  }

  private async getFileContent(file: string, ref: string): Promise<string> {
    try {
      return this.gitHelper.getFileContent(ref, file);
    } catch {
      return '';
    }
  }

  private analyzeNewFile(file: string, content: string): FrontendChange | null {
    const componentInfo = this.extractComponentInfo(file);
    const changes = this.parseFileContent(file, '', content);

    return {
      file,
      componentType: componentInfo.type,
      componentName: componentInfo.name,
      changeType: 'added',
      changes,
    };
  }

  private analyzeDeletedFile(file: string, content: string): FrontendChange | null {
    const componentInfo = this.extractComponentInfo(file);
    const changes = this.parseFileContent(file, content, '');

    return {
      file,
      componentType: componentInfo.type,
      componentName: componentInfo.name,
      changeType: 'deleted',
      changes,
    };
  }

  private analyzeModifiedFile(file: string, oldContent: string, newContent: string): FrontendChange | null {
    const componentInfo = this.extractComponentInfo(file);
    const changes = this.parseFileContent(file, oldContent, newContent);

    // Only return if there are actual changes
    if (Object.keys(changes).length === 0) {
      return null;
    }

    return {
      file,
      componentType: componentInfo.type,
      componentName: componentInfo.name,
      changeType: 'modified',
      changes,
    };
  }

  private parseFileContent(file: string, oldContent: string, newContent: string): FrontendChangeDetails {
    const changes: FrontendChangeDetails = {};

    if (file.endsWith('.twig')) {
      Object.assign(changes, this.compareTwigFeatures(oldContent, newContent));
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      Object.assign(changes, this.compareTypescriptFeatures(oldContent, newContent));
    } else if (file.endsWith('.scss') || file.endsWith('.css')) {
      Object.assign(changes, this.compareScssFeatures(oldContent, newContent));
    }

    return changes;
  }

  private compareTwigFeatures(oldContent: string, newContent: string): Partial<FrontendChangeDetails> {
    const oldFeatures = oldContent ? this.twigParser.parse(oldContent) : this.emptyTwigFeatures();
    const newFeatures = newContent ? this.twigParser.parse(newContent) : this.emptyTwigFeatures();

    return {
      addedDataAttributes: this.diff(newFeatures.dataAttributes, oldFeatures.dataAttributes),
      removedDataAttributes: this.diff(oldFeatures.dataAttributes, newFeatures.dataAttributes),
      addedBlocks: this.diff(newFeatures.blocks, oldFeatures.blocks),
      removedBlocks: this.diff(oldFeatures.blocks, newFeatures.blocks),
      addedIncludes: this.diff(newFeatures.includes, oldFeatures.includes),
      removedIncludes: this.diff(oldFeatures.includes, newFeatures.includes),
      addedMacros: this.diff(newFeatures.macros, oldFeatures.macros),
      removedMacros: this.diff(oldFeatures.macros, newFeatures.macros),
      addedDefineDataVariables: this.diff(newFeatures.defineDataVariables, oldFeatures.defineDataVariables),
      removedDefineDataVariables: this.diff(oldFeatures.defineDataVariables, newFeatures.defineDataVariables),
      addedAttributesKeys: this.diff(newFeatures.attributesKeys, oldFeatures.attributesKeys),
      removedAttributesKeys: this.diff(oldFeatures.attributesKeys, newFeatures.attributesKeys),
      addedMolecules: this.diff(newFeatures.molecules, oldFeatures.molecules),
      removedMolecules: this.diff(oldFeatures.molecules, newFeatures.molecules),
      addedWidgets: this.diff(newFeatures.widgets, oldFeatures.widgets),
      removedWidgets: this.diff(oldFeatures.widgets, newFeatures.widgets),
    };
  }

  private compareTypescriptFeatures(oldContent: string, newContent: string): Partial<FrontendChangeDetails> {
    const oldFeatures = oldContent ? this.typescriptParser.parse(oldContent) : this.emptyTypescriptFeatures();
    const newFeatures = newContent ? this.typescriptParser.parse(newContent) : this.emptyTypescriptFeatures();

    const visibilityChanges = this.detectVisibilityChanges(oldFeatures.methods, newFeatures.methods);

    return {
      addedMethods: this.diffMethods(newFeatures.methods, oldFeatures.methods),
      removedMethods: this.diffMethods(oldFeatures.methods, newFeatures.methods),
      addedEvents: this.diff(newFeatures.events, oldFeatures.events),
      removedEvents: this.diff(oldFeatures.events, newFeatures.events),
      visibilityChanges: visibilityChanges.length > 0 ? visibilityChanges : undefined,
    };
  }

  private compareScssFeatures(oldContent: string, newContent: string): Partial<FrontendChangeDetails> {
    const oldFeatures = oldContent ? this.scssParser.parse(oldContent) : this.emptyScssFeatures();
    const newFeatures = newContent ? this.scssParser.parse(newContent) : this.emptyScssFeatures();

    return {
      addedMixins: this.diff(newFeatures.mixins, oldFeatures.mixins),
      removedMixins: this.diff(oldFeatures.mixins, newFeatures.mixins),
      addedVariables: this.diff(newFeatures.variables, oldFeatures.variables),
      removedVariables: this.diff(oldFeatures.variables, newFeatures.variables),
      addedCssVariables: this.diff(newFeatures.cssVariables, oldFeatures.cssVariables),
      removedCssVariables: this.diff(oldFeatures.cssVariables, newFeatures.cssVariables),
      addedClasses: this.diff(newFeatures.classes, oldFeatures.classes),
      removedClasses: this.diff(oldFeatures.classes, newFeatures.classes),
      addedModifiers: this.diff(newFeatures.modifiers, oldFeatures.modifiers),
      removedModifiers: this.diff(oldFeatures.modifiers, newFeatures.modifiers),
    };
  }

  private extractComponentInfo(file: string): { type: FrontendChange['componentType']; name: string } {
    // Extract from path like: .../components/atoms/button/button.twig
    const atomMatch = file.match(/components\/atoms\/([\w-]+)/);
    if (atomMatch) return { type: 'atom', name: atomMatch[1] };

    const moleculeMatch = file.match(/components\/molecules\/([\w-]+)/);
    if (moleculeMatch) return { type: 'molecule', name: moleculeMatch[1] };

    const organismMatch = file.match(/components\/organisms\/([\w-]+)/);
    if (organismMatch) return { type: 'organism', name: organismMatch[1] };

    const templateMatch = file.match(/templates\/([\w-]+)/);
    if (templateMatch) return { type: 'template', name: templateMatch[1] };

    const pageMatch = file.match(/pages\/([\w-]+)/);
    if (pageMatch) return { type: 'page', name: pageMatch[1] };

    if (file.includes('/styles/')) return { type: 'style', name: file.split('/').pop()?.replace(/\.(scss|css)$/, '') || 'unknown' };
    if (file.endsWith('.ts') || file.endsWith('.js')) return { type: 'script', name: file.split('/').pop()?.replace(/\.(ts|js)$/, '') || 'unknown' };

    return { type: 'unknown', name: file.split('/').pop() || 'unknown' };
  }

  private diff<T>(newItems: T[], oldItems: T[]): T[] | undefined {
    const added = newItems.filter(item => !oldItems.includes(item));
    return added.length > 0 ? added : undefined;
  }

  private diffMethods(newMethods: MethodInfo[], oldMethods: MethodInfo[]): MethodInfo[] | undefined {
    const added = newMethods.filter(nm => !oldMethods.some(om => om.name === nm.name));
    return added.length > 0 ? added : undefined;
  }

  private detectVisibilityChanges(oldMethods: MethodInfo[], newMethods: MethodInfo[]): VisibilityChange[] {
    const changes: VisibilityChange[] = [];

    for (const oldMethod of oldMethods) {
      const newMethod = newMethods.find(m => m.name === oldMethod.name);
      if (newMethod && newMethod.visibility !== oldMethod.visibility) {
        changes.push({
          name: oldMethod.name,
          from: oldMethod.visibility,
          to: newMethod.visibility,
        });
      }
    }

    return changes;
  }

  private emptyTwigFeatures(): TwigFeatures {
    return { 
      dataAttributes: [], 
      includes: [], 
      blocks: [], 
      variables: [], 
      macros: [],
      defineDataVariables: [],
      attributesKeys: [],
      molecules: [],
      widgets: [],
    };
  }

  private emptyTypescriptFeatures(): TypescriptFeatures {
    return { classes: [], methods: [], properties: [], events: [] };
  }

  private emptyScssFeatures(): ScssFeatures {
    return { variables: [], cssVariables: [], mixins: [], classes: [], modifiers: [] };
  }
}
