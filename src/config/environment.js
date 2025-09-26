// Environment configuration
module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'user_management',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
};
