#!/usr/bin/env node

/**
 * Appkod CLI (gom/appkod)
 *
 * Command-line tool for scaffolding, generating, validating, and deploying
 * Appkod applications.
 *
 * Commands:
 *   appkod init          - Initialize new Appkod project
 *   appkod scaffold      - Create new app from template
 *   appkod generate      - Generate code from Blueprint
 *   appkod validate      - Validate Blueprint schema
 *   appkod dev           - Start local development environment
 *   appkod deploy        - Deploy app to Appkod platform
 *   appkod export        - Export generated code
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { scaffoldCommand } from './commands/scaffold';
import { generateCommand } from './commands/generate';
import { validateCommand } from './commands/validate';
import { devCommand } from './commands/dev';
import { deployCommand } from './commands/deploy';
import { exportCommand } from './commands/export';

const program = new Command();

program
  .name('appkod')
  .description('Appkod Platform CLI - Build VAD SOM HELST')
  .version('0.0.1');

// appkod init
program
  .command('init [project-name]')
  .description('Initialize a new Appkod project')
  .option('-t, --template <name>', 'Template to use (crm, blog, ecommerce)', 'blank')
  .action(initCommand);

// appkod scaffold <app-name>
program
  .command('scaffold <app-name>')
  .description('Create a new app from template')
  .option('-t, --template <name>', 'Template to use', 'crud')
  .option('-o, --output <dir>', 'Output directory', '.')
  .action(scaffoldCommand);

// appkod generate
program
  .command('generate [blueprint]')
  .description('Generate code from Blueprint')
  .option('-i, --input <file>', 'Blueprint file (YAML/JSON)', 'blueprint.yaml')
  .option('-o, --output <dir>', 'Output directory', './generated')
  .option('-w, --watch', 'Watch for Blueprint changes', false)
  .action(generateCommand);

// appkod validate <blueprint>
program
  .command('validate [blueprint]')
  .description('Validate Blueprint schema')
  .option('-v, --verbose', 'Verbose output', false)
  .action(validateCommand);

// appkod dev
program
  .command('dev')
  .description('Start local development environment')
  .option('-p, --port <port>', 'Port for web app', '3000')
  .option('--api-port <port>', 'Port for API', '8000')
  .action(devCommand);

// appkod deploy
program
  .command('deploy [environment]')
  .description('Deploy app to Appkod platform')
  .option('-e, --env <name>', 'Environment (dev, staging, prod)', 'dev')
  .option('--region <region>', 'AWS/GCP region', 'eu-north-1')
  .action(deployCommand);

// appkod export
program
  .command('export [output-dir]')
  .description('Export generated code')
  .option('-f, --format <format>', 'Export format (zip, tar.gz)', 'zip')
  .option('--include-deps', 'Include dependencies', false)
  .action(exportCommand);

// Error handling
program.on('command:*', () => {
  console.error(chalk.red(`\n❌ Invalid command: ${program.args.join(' ')}`));
  console.log(chalk.yellow('\nRun `appkod --help` for available commands.\n'));
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
