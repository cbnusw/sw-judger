const mongoose = require('mongoose');
const { readdirSync } = require('fs');
const { join } = require('path');
const options = require('./connection-options');
const { toCollectionName, toModelName } = require('../helpers');

module.exports = (uri, schemaPath, options = options) => {
  const models = {};

  const db = mongoose.createConnection(uri, options);

  readdirSync(schemaPath)
    .filter(file => /\.schema\.js$/.test(file))
    .forEach(file => {
      const modelName = toModelName(file);
      const collectionName = toCollectionName(file);
      const schema = require(join(schemaPath, file));
      models[modelName] = db.model(modelName, schema, collectionName);
    });

  return models;
};
