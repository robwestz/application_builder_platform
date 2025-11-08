import chalk from 'chalk';

interface ScaffoldOptions {
  template?: string;
  output?: string;
}

export async function scaffoldCommand(appName: string, options?: ScaffoldOptions): Promise<void> {
  console.log(chalk.bold('\n📦 Scaffold App\n'));
  console.log(chalk.gray(`  App: ${appName}`));
  console.log(chalk.gray(`  Template: ${options?.template || 'crud'}\n`));
  console.log(chalk.yellow('⚠️  Coming soon in Phase 1\n'));
}
