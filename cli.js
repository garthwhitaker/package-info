#!/usr/bin/env node

const program = require('commander');
const main = require('./index');

program
  .version('0.0.1')
  .description('Automated package checker tool');

program
  .command('check <package-name>')
  .description('Check a specific package')
  .action(packageName => {
    console.log(`checking a specific package: ${packageName}`);
    main.checkPackage(packageName);
  });

program
  .command('*')
  .description('Unsupported command')
  .action(() => {
    console.warn('The command you run is not supported. See help details below to verify your command.');
    program.outputHelp();
    process.exit();
  });

if (process.argv.slice(2).length === 0) {
  console.log('No specific package specified - checking all dependencies in package.json');
  main.checkAllDeps();
}

program.parse(process.argv);