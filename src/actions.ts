import path from 'path';
import fs, { globSync } from 'fs';
import { Stopwatch } from './utils/Stopwatch.ts';
import { Compiler } from './Compiler.ts';
import type { Command } from 'commander';

export const compileSingleProject = async (
  program: Command,
  sourceFile: string,
  outputFolder: string,
) => {
  const sourceFilePath = path.resolve(sourceFile);
  const outputFolderPath = path.resolve(outputFolder);

  if (!fs.existsSync(sourceFile)) {
    program.error(`Error: The source file "${sourceFile}" does not exist.`);
  }

  try {
    fs.mkdirSync(outputFolder, { recursive: true });
  } catch {
    program.error(
      `Error: Could not create output folder "${outputFolderPath}".`,
    );
  }

  const compiler = new Compiler(sourceFilePath, outputFolderPath);

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
};

export const compileMultipleProjects = async (
  program: Command,
  inputFolder: string,
  outputFolder: string,
  sourceFileName: string,
) => {
  const inputFolderPath = path.resolve(inputFolder);
  const outputFolderPath = path.resolve(outputFolder);

  if (!fs.existsSync(inputFolderPath)) {
    program.error(
      `Error: The input folder "${inputFolderPath}" does not exist.`,
    );
  }

  try {
    fs.mkdirSync(outputFolder, { recursive: true });
  } catch {
    program.error(
      `Error: Could not create output folder "${outputFolderPath}".`,
    );
  }

  const sourceFiles = globSync(`${inputFolderPath}/**/${sourceFileName}`);
  console.log(`Found ${sourceFiles.length} projects.`);

  for (let n = 0; n < sourceFiles.length; n++) {
    console.log();
    const sourceFilePath = sourceFiles[n];
    const projectName = path.basename(path.dirname(sourceFilePath));
    const projectOutputFolderPath = path.join(outputFolder, projectName);

    console.log(`[${n}] Compiling project: "${projectName}"`);
    await compileSingleProject(
      program,
      sourceFilePath,
      projectOutputFolderPath,
    );
  }
};
