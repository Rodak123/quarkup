import type { Blockquote, FootnoteDefinition, ListItem, Root } from 'mdast';
import type { z, ZodObject, ZodRawShape } from 'zod';
import type { QuarkupResult } from './types/quarkupResult.ts';
import type { QuarkupOption } from './types/quarkupSyntax.ts';

export type NodeParent = Blockquote | FootnoteDefinition | ListItem | Root;

export interface IQuarkupKeywordDefinition {
  name: string;
  use(tree: Root, options: QuarkupOption[]): QuarkupResult;
}

export abstract class QuarkupKeywordDefinition<
  T extends ZodRawShape,
> implements IQuarkupKeywordDefinition {
  _name: string;
  _optionsSchema: ZodObject<T>;

  constructor(name: string, optionsSchema: ZodObject<T>) {
    this._name = name;
    this._optionsSchema = optionsSchema;
  }

  abstract _use(options: z.infer<ZodObject<T>>, tree: Root): QuarkupResult;

  get name() {
    return this._name;
  }

  get options() {
    return this._optionsSchema;
  }

  use(tree: Root, rawOptions: QuarkupOption[]): QuarkupResult {
    const constructedOptions: Record<string, string> = {};
    for (const option of rawOptions) {
      constructedOptions[option.name] = option.value;
    }

    const options = this._optionsSchema.parse(constructedOptions);

    return this._use(options, tree);
  }
}
