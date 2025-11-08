import chalk from 'chalk';

interface DevOptions {
  port?: string;
  apiPort?: string;
}

export async function devCommand(options?: DevOptions): Promise<void> {
  console.log(chalk.bold('\n🚀 Starting Development Environment\n'));
  console.log(chalk.gray(`  Web: http://localhost:${options?.port || '3000'}`));
  console.log(chalk.gray(`  API: http://localhost:${options?.apiPort || '8000'}\n`));
  console.log(chalk.yellow('⚠️  Coming soon - Use `make dev-web` and `make dev-api` for now\n'));
}
