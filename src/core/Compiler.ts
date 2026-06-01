import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import { tailwindPlugin } from './tailwindPlugin.ts';

export class Compiler {
  _sourceFile: string;
  _outputDir: string;

  constructor(sourceFile: string, outputDir: string) {
    this._sourceFile = sourceFile;
    this._outputDir = outputDir;
  }

  _readContents(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File "${filePath}" doesn't exist`);
    }

    return fs.readFileSync(filePath).toString();
  }

  _writeContents(filePath: string, contents: string) {
    fs.writeFileSync(filePath, contents);
  }

  async compile() {
    console.log('Compiling');

    const source = this._readContents(this._sourceFile);

    const outputVFile = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypePrettyCode, {
        theme: 'github-dark-dimmed',
        grid: true,
      })
      .use(tailwindPlugin)
      .use(rehypeStringify)
      .process(source);
    const output = String(outputVFile);

    this._writeContents(path.join(this._outputDir, 'index.html'), output);
  }
}
