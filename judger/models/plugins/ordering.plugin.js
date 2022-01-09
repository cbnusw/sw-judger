module.exports = (property = 'order') => schema => {
  /**
   * id에 해당하는 순서(order)를 결정
   * @param {Array<{id: ObjectId | string, order: number }>} orderedItems
   * @return {Promise<Array>}
   */
  schema.statics.ordering = function (orderedItems) {
    return Promise.all(orderedItems.map(async item => {
      const { id, order } = item;
      const instance = await this.findById(id);
      instance[property] = order;
      await instance.save();
      return instance;
    }));
  };
};
