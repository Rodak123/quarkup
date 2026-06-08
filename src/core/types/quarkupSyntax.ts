export interface QuarkupConfig {
  keywordMark: string;
  optionMark: string;
}

export interface QuarkupOption {
  name: string;
  value: string;
}

export interface QuarkupKeyword {
  name: string;
  options: QuarkupOption[];
  start: number;
  end: number;
}
