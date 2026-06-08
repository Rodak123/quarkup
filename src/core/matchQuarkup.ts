import type {
  QuarkupConfig,
  QuarkupKeyword,
  QuarkupOption,
} from './types/quarkupSyntax.ts';

const keywordRegex = /([a-zA-Z]+)/;
const optionNameRegex = /([a-zA-Z]+)/;
const optionValueRegex = /\{([^}]+)\}/;

export const matchQuarkup = (
  config: QuarkupConfig,
  text: string,
): QuarkupKeyword[] => {
  const writedownRegex = new RegExp(
    `${config.keywordMark}${keywordRegex.source}((?:${config.optionMark}${optionNameRegex.source}${optionValueRegex.source})*)${config.keywordMark}`,
    'g',
  );

  const keywords: QuarkupKeyword[] = [];

  const matches = text.matchAll(writedownRegex);

  for (const match of matches) {
    const [fullMatch, name, optionsString] = match;

    const start = match.index!;
    const end = start + fullMatch.length;

    const options: QuarkupOption[] = [];

    const paramRegex = new RegExp(
      `${config.optionMark}${optionNameRegex.source}${optionValueRegex.source}`,
      'g',
    );

    let paramMatch;
    while ((paramMatch = paramRegex.exec(optionsString)) !== null) {
      options.push({
        name: paramMatch[1],
        value: paramMatch[2],
      });
    }

    keywords.push({
      name,
      options,
      start,
      end,
    });
  }

  return keywords;
};
