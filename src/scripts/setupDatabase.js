const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'user_management';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' created or already exists`);

    await connection.end();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  createDatabase();
}

module.exports = createDatabase;
