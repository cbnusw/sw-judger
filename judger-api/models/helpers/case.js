const { basename } = require('path');

exports.toCollectionName = filePath => {
  const name = basename(filePath);
  return name.replace(/\.schema\.js$/, '').replace(/-/g, '');
};

exports.toModelName = filePath => {
  const name = basename(filePath);
  return name.replace(/\.schema\.js$/, '')
    .split('-')
    .map(chunk => chunk[0].toUpperCase() + chunk.substr(1))
    .join('');
};
