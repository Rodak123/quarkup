import { toc } from 'mdast-util-toc';
import { WritedownKeywordDefinition } from '../WritedownKeywordDefinition.ts';
import type { Root } from 'mdast';
import { z } from 'zod';
import type { WritedownResult } from '../writedownResult.ts';

const TableOfContentsSchema = z.object({
  maxDepth: z
    .preprocess(
      (val) => (typeof val === 'string' ? parseInt(val) : val),
      z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
      ]),
    )
    .default(6),
});

type TableOfContentsOptions = z.infer<typeof TableOfContentsSchema>;

export class TableOfContents extends WritedownKeywordDefinition<
  typeof TableOfContentsSchema.shape
> {
  constructor() {
    super('tableofcontents', TableOfContentsSchema);
  }

  _use(options: TableOfContentsOptions, tree: Root): WritedownResult {
    const result = toc(tree, {
      maxDepth: options.maxDepth,
    });

    if (result.map === undefined) {
      return null;
    }

    const contentsList = result.map;

    contentsList.data = {
      ...contentsList.data,
      hProperties: {
        ...contentsList.data?.hProperties,
        'data-toc': true,
      },
    };

    return {
      type: 'block',
      value: [contentsList],
    };
  }
}
