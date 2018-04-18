const axios = require("axios");
const fs = require("fs");
const chalk = require('chalk');
const config = require('./config');
 
fs.readFile("package.json", "utf8", (err, data) => {
  if (err) throw err;

  const { dependencies } = JSON.parse(data);

  for (let prop in dependencies) {
    axios
      .get(`${config.api}/${prop}`)
      .then(response => {
        const {
          data: {
            collected:{
                metadata
            }
          }
        } = response;
        console.log(chalk.blue(`${prop}: ${metadata.version}`));
      })
      .catch(error => {
        console.error(error);
      });
  }
});
