const isCompareValues = values =>
  1 <= values.length && values.length <= 2 && values.every(v => ['<', '>'].includes(v[0]));

module.exports = (mapper, delimiter = ',') => async v => {
  const values = v.split(delimiter);
  if (isCompareValues(values)) {
    const condition = {};
    for (let v of values) {
      if (v.startsWith('>=')) condition.$gte = await mapper(v.substr(2));
      else if (v.startsWith('<=')) condition.$lte = await mapper(v.substr(2));
      else if (v.startsWith('>')) condition.$gt = await mapper(v.substr(1));
      else condition.$lt = await mapper(v.substr(1));
    }
    return condition;
  } else if (values.length === 1) {
    return await mapper(values[0]);
  }
};
