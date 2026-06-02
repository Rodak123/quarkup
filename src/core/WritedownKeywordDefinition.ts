import type { Blockquote, FootnoteDefinition, ListItem, Root } from 'mdast';
import type { z, ZodObject, ZodRawShape } from 'zod';
import type { WritedownResult } from './writedownResult.ts';
import type { WritedownOption } from './matchWritedown.ts';

export type NodeParent = Blockquote | FootnoteDefinition | ListItem | Root;

export interface IWritedownKeywordDefinition {
  name: string;
  use(tree: Root, options: WritedownOption[]): WritedownResult;
}

export abstract class WritedownKeywordDefinition<
  T extends ZodRawShape,
> implements IWritedownKeywordDefinition {
  _name: string;
  _optionsSchema: ZodObject<T>;

  constructor(name: string, optionsSchema: ZodObject<T>) {
    this._name = name;
    this._optionsSchema = optionsSchema;
  }

  abstract _use(options: z.infer<ZodObject<T>>, tree: Root): WritedownResult;

  get name() {
    return this._name;
  }

  get options() {
    return this._optionsSchema;
  }

  use(tree: Root, rawOptions: WritedownOption[]): WritedownResult {
    const constructedOptions: Record<string, string> = {};
    for (const option of rawOptions) {
      constructedOptions[option.name] = option.value;
    }

    const options = this._optionsSchema.parse(constructedOptions);

    return this._use(options, tree);
  }
}
