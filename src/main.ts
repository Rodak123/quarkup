#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { Compiler } from './Compiler.ts';
import { Stopwatch } from './utils/Stopwatch.ts';

const program = new Command();

program
  .name('quarkup')
  .description('A simple markdown to HTML compiler')
  .version('1.0.0');

program
  .command('c')
  .description('Compile a file')
  .argument('<source>', 'file to compile')
  .option('-o, --output <output>', 'the target output directory', 'html')
  .action(async (file: string, options: { output: string }) => {
    const sourceFile = path.resolve(file);
    const outputDir = path.resolve(options.output);

    if (!fs.existsSync(sourceFile)) {
      program.error(`Error: The source file "${file}" does not exist.`);
    }

    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch {
      program.error(
        `Error: Could not create output directory "${options.output}".`,
      );
    }

    const compiler = new Compiler(sourceFile, outputDir);

    try {
      const stopwatch = new Stopwatch();

      stopwatch.start();

      await compiler.compile();

      stopwatch.stop();

      const duration = stopwatch.secondsElapsed;

      console.log(`Success: Compilation finished in ${duration.toFixed(2)}s`);
    } catch (err) {
      program.error(`Error: Compilation failed: "${err}"`);
    }
  });

program.parse();
