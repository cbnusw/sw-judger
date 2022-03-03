const { readdirSync, statSync } = require('fs');
const { join } = require('path');

let models = {};

readdirSync(__dirname)
  .filter(dir => dir.startsWith('@') && statSync(join(__dirname, dir)).isDirectory())
  .forEach(dir => models = { ...models, ...require(`./${dir}`) });

module.exports = models;
