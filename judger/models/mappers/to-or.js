module.exports = (mapper, delimiter = ',') => async v => {
  const values = v.split(delimiter);
  if (values.length > 1) {
    const $in = [];
    for (const v of values) $in.push(await mapper(v));
    return { $in };
  } else if (values.length === 1) {
    return await mapper(value[0]);
  }
};
