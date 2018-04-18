const axios = require("axios");
const fs = require("fs");
const chalk = require('chalk');
const config = require('./config');

const checkAllDeps = () => {
  const result = {};
  
  fs.readFile("package.json", "utf8", (err, data) => {
    if (err) throw err;

    const { dependencies } = JSON.parse(data);

    for (let packageName in dependencies) {
      checkPackage(packageName);
    }
  });
};

const checkPackage = packageName =>
  axios
    .get(`${config.api}/${packageName}`)
    .then(response => {
      const {
        data: {
          collected: {
            metadata
          }
        }
      } = response;
      console.log(chalk.blue(`${packageName}: ${metadata.version}`));
    })
    .catch(error => {
      console.error(error.message);
    });

module.exports = {
  checkAllDeps,
  checkPackage,
};
