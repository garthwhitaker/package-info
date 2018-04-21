#!/usr/bin/env node
const program = require("commander");
const inquirer = require("inquirer");
const main = require("./index");
const npm = require("npm");
const chalk = require('chalk');

program.version("0.0.1").description("Automated package checker tool");

program
  .command("check <package-name>")
  .description("Check a specific package")
  .action(packageName => {
    console.log(`checking a specific package: ${packageName}`);
    main.checkPackage(packageName);
  });

program
  .command("*")
  .description("Unsupported command")
  .action(() => {
    console.warn(
      "The command you run is not supported. See help details below to verify your command."
    );
    program.outputHelp();
    process.exit();
  });

program
  .option("--i")
  .description("interactive mode")
  .parse(process.argv);

if (process.argv.slice(2).length === 0) {
  console.log(
    "No specific package specified - checking all dependencies in package.json"
  );
  main
    .checkAllDeps()
    .then(result => {
      const availableUpdates = result.filter(
        item => Object.keys(item).length > 0
      );

      const packages = availableUpdates.reduce((accumulator, current) => {
        accumulator[current.name] = current.packageVersion;
        return accumulator;
      }, {});

     if(!availableUpdates.length)
     {
       console.log(chalk.green('All packages are up to date.'));
       return; 
     }

      inquirer
        .prompt([
          {
            type: "checkbox",
            message: `Select from the available updates  or press (Ctrl + C) to exit.\n`,
            name: "update",
            choices: [...availableUpdates]
          }
        ])

        .then(answer => {
          if (answer.update !== "Cancel") {
        console.log(answer);

            for(let i=0; i < answer.update.length; i++) {
            npm.load(function(err) {
          
              npm.commands.install([`${answer.update[i]}@${packages[answer.update[i]]}`], function (er, data) {
                if (er) return console.error(er);
                console.log(data);
                // command succeeded, and data might have some info
              })

              npm.on('log', function(message) {
                // log installation progress
                console.log(message);
              });
            });
          }

          } else {
            console.log("Exit");
          }
      
        });
    })
    .then()
    .catch(console.error);
}

if (program.i) {
  console.log("interactive mode");
}
program.parse(process.argv);
