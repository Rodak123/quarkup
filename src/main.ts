#!/usr/bin/env node

import { Command } from 'commander';
import { compileMultipleProjects, compileSingleProject } from './actions.ts';

const program = new Command();

program
  .name('quarkup')
  .description('A simple markdown to HTML compiler')
  .version('1.0.0');

program
  .command('s')
  .description('Compile a single project')
  .argument('<source_file>', 'source file to compile')
  .option('-o, --output <output_folder>', 'the target output folder', 'html')
  .action(async (sourceFile: string, options: { output: string }) => {
    await compileSingleProject(program, sourceFile, options.output);
  });

program
  .command('m')
  .description('Compile multiple projects')
  .argument('<input_folder>', 'folder containing projects in subfolders')
  .option('-o, --output <output_folder>', 'the target output folder', 'html')
  .option('-m, --main-file <main_file>', 'main.md')
  .action(
    async (
      inputFolder: string,
      options: { output: string; mainFile: string },
    ) => {
      await compileMultipleProjects(
        program,
        inputFolder,
        options.output,
        options.mainFile,
      );
    },
  );

program.parse();
