const { Schema } = require('mongoose');
const { createSchema } = require('../../helpers');
const { searchPlugin } = require('../../plugins');
const { toRegEx, toRef } = require('../../mappers');

const periodSchema = createSchema({
  start: {
    type: Date,
    index: true,
    required: true,
  },
  end: {
    type: Date,
    index: true,
    required: true,
  },
}, false);



const contentSchema = createSchema({
  text: {
    type: String,
    trim: true,
  }
}, false)

const schema = createSchema({
  numId: { type: Number, index: true },
  course: String,
  title: {
    type: String,
    trim: true,
    required: true,
    index: true,
  },
  problems: [{
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  }],
  content: contentSchema,
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'UserInfo',
    required: true,
    index: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'UserInfo',
    required: true,
  }]
});

schema.index({ createdAt: -1 });

schema.plugin(searchPlugin({
  sort: '-createdAt',
  populate: [{ path: 'writer' }],
  mapper: {
    title: toRegEx,
    writer: toRef('UserInfo', {
      name: toRegEx
    }),
  }
}));

schema.pre('save', async next => {
  const record = this;
  if (post.isNew) record.numId = getCounter();
  return next();
  async function getCounter() {
    counter = await Counter.findOne({ name: 'Assignment' }).exec();
    if (!counter) await Counter.create({ name: 'Assignment' });
    counter.count++;
    counter.save();
    return counter.count;
  }
})