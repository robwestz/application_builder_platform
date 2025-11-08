/**
 * Validate command - Validate Blueprint schema
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import yaml from 'yaml';
import { validateBlueprint } from '@appkod/contracts';

interface ValidateOptions {
  verbose?: boolean;
}

export async function validateCommand(
  blueprint?: string,
  options?: ValidateOptions
): Promise<void> {
  const file = blueprint || 'blueprint.yaml';

  console.log(chalk.bold('\n🔍 Blueprint Validator\n'));

  if (!fs.existsSync(file)) {
    console.error(chalk.red(`❌ File not found: ${file}`));
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(file, 'utf-8');
    const ext = path.extname(file);
    let data;

    if (ext === '.yaml' || ext === '.yml') {
      data = yaml.parse(content);
    } else {
      data = JSON.parse(content);
    }

    const result = validateBlueprint(data);

    if (result.success) {
      console.log(chalk.green('✅ Blueprint is valid!\n'));

      if (options?.verbose) {
        console.log(chalk.bold('Blueprint Summary:\n'));
        console.log(chalk.cyan(`  Name:        ${result.data.name}`));
        console.log(chalk.cyan(`  Version:     ${result.data.version}`));
        console.log(chalk.cyan(`  Description: ${result.data.description || 'N/A'}`));
        console.log(chalk.cyan(`  Tables:      ${result.data.database.tables.length}`));
        console.log(chalk.cyan(`  Pages:       ${result.data.ui.pages.length}`));
        console.log(chalk.cyan(`  Endpoints:   ${result.data.api.endpoints.length}\n`));
      }

      process.exit(0);
    } else {
      console.log(chalk.red('❌ Blueprint validation failed\n'));
      console.log(chalk.red('Errors:\n'));
      result.errors.errors.forEach((error: any, idx: number) => {
        console.log(chalk.red(`  ${idx + 1}. ${error.path.join('.')}: ${error.message}`));
      });
      console.log();
      process.exit(1);
    }
  } catch (error: any) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
    process.exit(1);
  }
}
