import chalk from 'chalk';
import ora from 'ora';

interface InitOptions {
  template?: string;
}

export async function initCommand(projectName?: string, options?: InitOptions): Promise<void> {
  const name = projectName || 'my-appkod-project';
  const template = options?.template || 'blank';

  console.log(chalk.bold('\n🎉 Initialize Appkod Project\n'));
  console.log(chalk.gray(`  Project: ${name}`));
  console.log(chalk.gray(`  Template: ${template}\n`));

  const spinner = ora('Creating project...').start();

  // TODO: Implement project scaffolding
  await new Promise((resolve) => setTimeout(resolve, 1000));

  spinner.succeed(chalk.green(`✅ Project "${name}" created`));

  console.log(chalk.bold('\n✨ Next steps:\n'));
  console.log(chalk.gray(`  cd ${name}`));
  console.log(chalk.gray('  appkod scaffold my-app'));
  console.log(chalk.gray('  appkod dev\n'));
}
