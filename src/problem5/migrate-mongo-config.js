const dotenv = require('dotenv');
dotenv.config();

const url = process.env.MONGODB_URI;

const config = {
  mongodb: {
    url,
    databaseName: url.split('/').pop().split('?')[0],

    ooptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    collectionName: {
      resource: 'resources',
    },
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  lockCollectionName: 'changelog_lock',
  lockTtl: 0,
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
