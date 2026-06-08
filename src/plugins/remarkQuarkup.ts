import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Paragraph, PhrasingContent, BlockContent } from 'mdast';
import { matchQuarkup } from '../core/matchQuarkup.ts';
import type { IQuarkupKeywordDefinition } from '../core/QuarkupKeywordDefinition.ts';
import { TableOfContents } from '../core/keywords/TableOfContents.ts';
import type {
  QuarkupConfig,
  QuarkupKeyword,
} from '../core/types/quarkupSyntax.ts';

export interface RemarkQuarkupOptions {
  config: QuarkupConfig;
}

export const remarkQuarkup: Plugin<[RemarkQuarkupOptions?], Root> = (
  options = { config: { keywordMark: '&', optionMark: ':' } },
) => {
  const { config } = options;

  const keywordDefinitions: IQuarkupKeywordDefinition[] = [
    new TableOfContents(),
  ];

  const keywordDefinitionMap: Record<string, IQuarkupKeywordDefinition> = {};
  for (const keywordDefinition of keywordDefinitions) {
    keywordDefinitionMap[keywordDefinition.name] = keywordDefinition;
  }

  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (parent === undefined || index === undefined) return;

      const newBlocks: BlockContent[] = [];
      let currentPhrasing: PhrasingContent[] = [];
      let hasChange = false;

      const flushPhrasing = () => {
        if (currentPhrasing.length > 0) {
          newBlocks.push({
            type: 'paragraph',
            children: [...currentPhrasing],
          });
          currentPhrasing = [];
        }
      };

      const raiseError = (keyword: QuarkupKeyword, message: string) => {
        flushPhrasing();
        newBlocks.push({
          type: 'paragraph',
          children: [
            {
              type: 'strong',
              children: [
                {
                  type: 'text',
                  value: keyword.name,
                },
              ],
            },
            { type: 'text', value: ' raised error: ' },
            {
              type: 'emphasis',
              children: [{ type: 'text', value: message }],
            },
          ],
          data: {
            hProperties: {
              'data-writedown-error': true,
            },
          },
        });
      };

      for (const child of node.children) {
        if (child.type !== 'text') {
          currentPhrasing.push(child);
          continue;
        }

        const keywords = matchQuarkup(config, child.value);
        if (keywords.length === 0) {
          currentPhrasing.push(child);
          continue;
        }

        hasChange = true;
        let lastIndex = 0;

        for (const keyword of keywords) {
          if (keyword.start > lastIndex) {
            currentPhrasing.push({
              type: 'text',
              value: child.value.slice(lastIndex, keyword.start),
            });
          }

          const definition = keywordDefinitionMap[keyword.name];

          if (!definition) {
            raiseError(keyword, `Unknown keyword: "${keyword.name}"`);
          } else {
            try {
              const result = definition.use(tree, keyword.options);

              if (result === null) {
                raiseError(keyword, `Failed to use: "${keyword.name}"`);
              } else if (result.type === 'phrasing') {
                currentPhrasing.push(...result.value);
              } else if (result.type === 'block') {
                flushPhrasing();
                newBlocks.push(...result.value);
              }
            } catch (err) {
              raiseError(
                keyword,
                `Failed to use: "${keyword.name}", error: ${err}`,
              );
            }
          }
          lastIndex = keyword.end;
        }

        if (lastIndex < child.value.length) {
          currentPhrasing.push({
            type: 'text',
            value: child.value.slice(lastIndex),
          });
        }
      }

      if (hasChange) {
        flushPhrasing();

        parent.children.splice(index, 1, ...newBlocks);

        return index + newBlocks.length;
      }
    });
  };
};
