const { merge } = require('lodash');

const conditionFactory = async ({ defaultCondition, condition, forcedCondition, mapper }) => {
  condition = condition || {};

  if (condition['q']) {
    let [properties, value] = condition['q'].split('=');
    properties = properties.split(',').filter(prop => prop in mapper);
    if (properties.length > 1 && value) {
      condition.$or = [];
      for (const prop of properties) {
        if (prop in mapper) {
          const cond = {};
          const v = await mapper[prop](value);
          if (v !== undefined) {
            cond[prop] = v;
            condition.$or.push(cond);
          }
        }
      }
    } else if (properties.length === 1 && value) {
      const prop = properties[0];
      const v = await mapper[prop](value);
      if (v !== undefined) {
        condition[prop] = v;
      }
    }
    delete condition['q'];
  } else {
    for (const k in condition) {
      if (k in mapper) {
        const v = await mapper[k](condition[k]);
        if (v !== undefined) condition[k] = v;
      } else delete condition[k];
    }
  }

  return merge({ ...defaultCondition }, condition, forcedCondition);
};

const countPlugin = ({ defaultCondition, mapper }) => schema =>
  schema.statics.countAll = async function (condition, forcedCondition) {
    condition = await conditionFactory({ defaultCondition, condition, forcedCondition, mapper });
    return this.countDocuments(condition);
  };

const searchPlugin = ({ defaultCondition, mapper, populate, select, sort }) => schema =>
  schema.statics.search = async function (condition, forcedCondition, additionalPopulate, additionalSelect = '', noCount = false) {
    const page = +(condition.page || 1);
    const limit = +condition.limit;

    sort = condition.sort || sort || undefined;

    forcedCondition = forcedCondition || {};
    additionalPopulate = additionalPopulate || [];

    ['page', 'limit', 'sort'].forEach(k => delete condition[k]);

    condition = await conditionFactory({ defaultCondition, condition, forcedCondition, mapper });

    const query = this.find(condition);

    if (select) query.select(`${select} ${additionalSelect}`.trim());

    if (populate) {
      populate = !Array.isArray(populate) ? [populate] : populate;
      populate.forEach(p => query.populate(p));
    }

    if (additionalPopulate.length > 0) {
      additionalPopulate = !Array.isArray(additionalPopulate) ? [additionalPopulate] : additionalPopulate;
      additionalPopulate.forEach(p => query.populate(p));
    }

    if (!isNaN(limit) || limit) {
      const skip = limit * ((isNaN(page) ? 1 : page) - 1);
      query.limit(limit);
      query.skip(skip);
    }

    if (sort) query.sort(sort);

    const documents = await query.exec();
    const total = noCount ? documents.length : await this.countDocuments(condition);

    return { total, page, limit, documents };
  };

module.exports = ({ defaultCondition = {}, mapper = {}, populate, select, sort } = {}) => schema => {
  schema.plugin(countPlugin({ defaultCondition, mapper }));
  schema.plugin(searchPlugin({ defaultCondition, mapper, populate, select, sort }));
};
