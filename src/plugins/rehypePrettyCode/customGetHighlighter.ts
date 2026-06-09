import type {
  BundledHighlighterOptions,
  BundledLanguage,
  BundledTheme,
  LanguageRegistration,
} from 'shiki';
import { getSingletonHighlighter } from 'shiki/bundle/full';
import quarkdownGrammar from './quarkdown.tmLanguage.json' with { type: 'json' };

// TODO: Add support for quarkup keywords :)

export const customGetHighlighter = async (
  options: BundledHighlighterOptions<BundledLanguage, BundledTheme>,
) => {
  const quarkdownLang: LanguageRegistration = {
    aliases: ['quark', 'qd', 'quarkdown'],
    ...quarkdownGrammar,
  };

  return getSingletonHighlighter({
    ...options,
    langs: [...(options.langs || []), quarkdownLang],
  });
};
