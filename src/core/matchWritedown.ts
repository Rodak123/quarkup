export interface WritedownConfig {
  keywordMark: string;
  optionMark: string;
}

export interface WritedownOption {
  name: string;
  value: string;
}

export interface WritedownKeyword {
  name: string;
  options: WritedownOption[];
  start: number;
  end: number;
}

const keywordRegex = /([a-zA-Z]+)/;
const optionNameRegex = /([a-zA-Z]+)/;
const optionValueRegex = /\{([^}]+)\}/;

export const matchWritedown = (
  config: WritedownConfig,
  text: string,
): WritedownKeyword[] => {
  const writedownRegex = new RegExp(
    `${config.keywordMark}${keywordRegex.source}((?:${config.optionMark}${optionNameRegex.source}${optionValueRegex.source})*)${config.keywordMark}`,
    'g',
  );

  const keywords: WritedownKeyword[] = [];

  const matches = text.matchAll(writedownRegex);

  for (const match of matches) {
    const [fullMatch, name, optionsString] = match;

    const start = match.index!;
    const end = start + fullMatch.length;

    const options: WritedownOption[] = [];

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
