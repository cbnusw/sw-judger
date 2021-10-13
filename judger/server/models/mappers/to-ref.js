module.exports = (refModelName, mappers) => async v => {
  const Model = require('../')[refModelName];
  const $or = [];

  for (let key in mappers) {
    const cond = {};
    cond[key] = await mappers[key](v);
    $or.push(cond);
  }

  const instances = await Model.find({ $or }).select('_id').exec();
  return { $in: instances.map(i => i._id) };
};
