import type { BlockContent, PhrasingContent } from 'mdast';

export interface QuarkupResultPhrasing {
  type: 'phrasing';
  value: PhrasingContent[];
}

export interface QuarkupResultBlock {
  type: 'block';
  value: BlockContent[];
}

export type QuarkupResult = null | QuarkupResultPhrasing | QuarkupResultBlock;
