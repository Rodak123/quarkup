import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import type { Plugin } from 'unified';

export const rehypeMathjaxFigure: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      const isBlockMath =
        node.tagName === 'mjx-container'
        && node.properties?.display === 'true';

      if (!isBlockMath || parent === undefined || index === undefined) { 
        return;
      }

      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: { 'data-math-block': '' },
        children: [node]
      };

      parent.children[index] = figure;
    });
  };
};
