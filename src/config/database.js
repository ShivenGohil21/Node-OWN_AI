require('reflect-metadata');
const { DataSource } = require('typeorm');
const User = require('../models/User');
const path = require('path');

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../../database.sqlite'),
  synchronize: true,
  logging: false,
  entities: [User],
});

module.exports = AppDataSource;
