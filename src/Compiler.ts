import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax/svg';

import { rehypeMathjaxFigure } from './plugins/rehypeMathjaxFigure.ts';
import { remarkWritedown } from './plugins/remarkWritedown.ts';
import rehypeSlug from 'rehype-slug';

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
      .use(remarkParse) // to MD AST
      .use(remarkMath) // parse math
      .use(remarkGfm) // parse Github FM
      .use(remarkWritedown) // parse custom Writedown syntax

      .use(remarkRehype) // MD to HTML

      .use(rehypeSlug) // Add id to headings
      .use(rehypeMathjax) // render math
      .use(rehypeMathjaxFigure) // wrap math in <figure>

      .use(rehypePrettyCode, {
        theme: 'github-dark-dimmed',
        grid: true,
      }) // render code

      .use(rehypeStringify) // to HTML text

      .process(source);
    const output = String(outputVFile);

    this._writeContents(path.join(this._outputDir, 'index.html'), output);
  }
}
