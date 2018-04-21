const axios = require("axios");
const fs = require("fs");
const chalk = require("chalk");
const config = require("./config");
const semver = require('semver');

const checkAllDeps = () => {
  const result = [];

  const data = fs.readFileSync("package.json", "utf8");
  const { dependencies } = JSON.parse(data);

  for (let packageName in dependencies) {
    const version = semver.valid(semver.coerce(dependencies[packageName]));
    result.push(checkPackage(packageName, version));
  }

  return Promise.all(result);
};

const checkPackage = (packageName, version) => {
  const url = `${config.api}/${packageName}`;

  return axios
    .get(`${url}`)
    .then(response => {
      const {
        data: {
          collected: { metadata }
        }
      } = response;
      const packageInfo = { name: metadata.name, packageVersion: metadata.version };
      return semver.gt(metadata.version,version)
        ? packageInfo
        : {};
    })
    .catch(error => {
      console.error(error.message);
    });
};

module.exports = {
  checkAllDeps,
  checkPackage
};
