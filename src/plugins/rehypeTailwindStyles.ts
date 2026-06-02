import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import type { Plugin } from 'unified';

const textBase = 'antialiased';
const textClasses: Record<string, string> = {
  h1: 'text-7xl font-extrabold tracking-tight leading-tight' + textBase,
  h2: 'text-4xl font-semibold tracking-tight leading-snug' + textBase,
  h3: 'text-3xl font-semibold tracking-normal leading-snug' + textBase,
  h4: 'text-3xl font-medium tracking-normal leading-snug' + textBase,
  h5: 'text-3xl font-medium tracking-normal leading-normal' + textBase,
  h6: 'text-3xl font-medium tracking-normal leading-normal' + textBase,
  p: 'font-normal leading-relaxed tracking-normal' + textBase,
};

export const rehypeTailwindStyles: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const classes: Record<string, string> = {
        ...textClasses,
        a: 'hover:underline',
        ul: 'list-disc ml-6 mb-4',
        li: 'mb-1',
        blockquote: 'border-l-4 border-gray-300 pl-4 italic my-4',
      };

      const tagName = node.tagName;

      if (!classes[tagName]) { 
        return;
      }

      node.properties = node.properties || {};
      node.properties.className = classes[tagName];
    });
  };
};
