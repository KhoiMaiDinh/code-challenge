const RESOURCE_COLLECTION = 'resources';

module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    const collections = await db
      .listCollections({ name: RESOURCE_COLLECTION })
      .toArray();
    if (collections.length === 0) {
      await db.createCollection(RESOURCE_COLLECTION);
    }

    // Create indexes for better query performance
    await db.collection(RESOURCE_COLLECTION).createIndexes([
      { key: { name: 1 }, name: 'name_idx' },
      { key: { type: 1 }, name: 'type_idx' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
    ]);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection(RESOURCE_COLLECTION).drop();
  },
};
