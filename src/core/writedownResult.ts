import type { BlockContent, PhrasingContent } from 'mdast';

export interface WritedownResultPhrasing {
  type: 'phrasing';
  value: PhrasingContent[];
}

export interface WritedownResultBlock {
  type: 'block';
  value: BlockContent[];
}

export type WritedownResult =
  | null
  | WritedownResultPhrasing
  | WritedownResultBlock;
