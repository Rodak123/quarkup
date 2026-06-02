import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Paragraph, PhrasingContent, BlockContent } from 'mdast';
import {
  matchWritedown,
  type WritedownConfig,
} from '../core/matchWritedown.ts';
import type { IWritedownKeywordDefinition } from '../core/WritedownKeywordDefinition.ts';
import { TableOfContents } from '../core/keywords/TableOfContents.ts';

export interface RemarkWritedownOptions {
  config: WritedownConfig;
}

export const remarkWritedown: Plugin<[RemarkWritedownOptions?], Root> = (
  options = { config: { keywordMark: '&', optionMark: ':' } },
) => {
  const { config } = options;

  const keywordDefinitions: IWritedownKeywordDefinition[] = [
    new TableOfContents(),
  ];

  const keywordDefinitionMap: Record<string, IWritedownKeywordDefinition> = {};
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

      for (const child of node.children) {
        if (child.type !== 'text') {
          currentPhrasing.push(child);
          continue;
        }

        const keywords = matchWritedown(config, child.value);
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
            currentPhrasing.push({
              type: 'text',
              value: `Unknown keyword: "${keyword.name}"`,
            });
          } else {
            try {
              const result = definition.use(tree, keyword.options);

              if (result === null) {
                currentPhrasing.push({
                  type: 'text',
                  value: `Failed to use: "${keyword.name}"`,
                });
              } else if (result.type === 'phrasing') {
                currentPhrasing.push(...result.value);
              } else if (result.type === 'block') {
                flushPhrasing();
                newBlocks.push(...result.value);
              }
            } catch (err) {
              currentPhrasing.push({
                type: 'text',
                value: `Failed to use: "${keyword.name}", error: ${err}`,
              });
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
