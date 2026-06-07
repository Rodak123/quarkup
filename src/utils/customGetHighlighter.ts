import type {
  BundledHighlighterOptions,
  BundledLanguage,
  BundledTheme,
} from 'shiki';
import { getSingletonHighlighter } from 'shiki/bundle/full';

// TODO: Add support for quarkup keywords :)

export const customGetHighlighter = async (
  options: BundledHighlighterOptions<BundledLanguage, BundledTheme>,
) => {
  return getSingletonHighlighter({
    ...options,
    langs: [...(options.langs || [])],
  });
};
