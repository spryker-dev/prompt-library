export interface Location {
  source: string | null;
  start: { line: number; column: number; offset: number };
  end: { line: number; column: number; offset: number };
}

export interface Comment {
  kind: 'commentblock' | 'commentline';
  value: string;
  loc?: Location;
}

export interface BaseNode {
  kind: string;
  loc?: Location;
  leadingComments?: Comment[];
  comments?: Comment[];
  doc?: string;
}

export interface Identifier extends BaseNode {
  kind: 'identifier';
  name: string;
}

export interface Name extends BaseNode {
  kind: 'name';
  name: string;
  resolution?: 'fqn' | 'uqn' | 'rn' | null;
}

export interface Parameter extends BaseNode {
  kind: 'parameter';
  name: Identifier | string;
  type?: Name | NullableType | null;
  value?: any;
  byref: boolean;
  variadic: boolean;
  readonly: boolean;
  nullable: boolean;
  flags?: number;
  visibility?: 'public' | 'protected' | 'private' | null;
  attrGroups?: any[];
}

export interface NullableType extends BaseNode {
  kind: 'nullabletype';
  what: Name;
}

export interface Method extends BaseNode {
  kind: 'method';
  name: Identifier;
  arguments?: Parameter[];
  params?: Parameter[];
  body?: any;
  visibility?: 'public' | 'protected' | 'private';
  isStatic?: boolean;
  isAbstract?: boolean;
  isFinal?: boolean;
}

export interface Property extends BaseNode {
  kind: 'property';
  name: Identifier | string;
  type?: Name | NullableType | null;
  properties?: Array<{ name: Identifier | string }>;
}

export interface PropertyStatement extends BaseNode {
  kind: 'propertystatement';
  type?: Name | NullableType | null;
  properties?: Property[];
}

export interface Class extends BaseNode {
  kind: 'class';
  name: Identifier;
  body: Array<Method | Property | PropertyStatement | any>;
  extends?: Name | null;
  implements?: Name[];
}

export interface Interface extends BaseNode {
  kind: 'interface';
  name: Identifier;
  body: Method[];
  extends?: Name[];
}

export interface Namespace extends BaseNode {
  kind: 'namespace';
  name: string | Name;
  children?: any[];
}

export interface UseItem extends BaseNode {
  kind: 'useitem';
  name: string | Name;
  alias?: Identifier | null;
  type?: 'function' | 'const' | 'class' | null;
}

export interface UseGroup extends BaseNode {
  kind: 'usegroup';
  name: string | Name;
  items: UseItem[];
}

export interface Variable extends BaseNode {
  kind: 'variable';
  name: string;
}

export interface Call extends BaseNode {
  kind: 'call';
  what: any;
  arguments?: any[];
}

export interface StaticCall extends BaseNode {
  kind: 'staticcall';
  class: Name;
  what: Identifier | string;
}

export interface PropertyLookup extends BaseNode {
  kind: 'propertylookup' | 'nullsafe_propertylookup';
  what: any;
  offset: Identifier | string;
}

export interface StaticLookup extends BaseNode {
  kind: 'staticlookup';
  what: any;
  offset: Identifier | string;
}

export interface New extends BaseNode {
  kind: 'new';
  what: Name;
  arguments?: any[];
}

export interface Assign extends BaseNode {
  kind: 'assign';
  left: Variable | PropertyLookup | any;
  right: any;
}

export interface Return extends BaseNode {
  kind: 'return';
  expr?: any;
}

export type ASTNode =
  | BaseNode
  | Identifier
  | Name
  | Parameter
  | Method
  | Property
  | PropertyStatement
  | Class
  | Interface
  | Namespace
  | UseItem
  | UseGroup
  | Variable
  | Call
  | StaticCall
  | PropertyLookup
  | StaticLookup
  | New
  | Assign
  | Return;
