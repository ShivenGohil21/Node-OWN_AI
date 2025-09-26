const request = require('supertest');
const app = require('./src/server');

describe('User Management API', () => {
  describe('Health Check', () => {
    it('should return API status', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body.message).toBe('User Management API is running');
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        role: 'Staff',
        phone: '+1234567890',
        city: 'Test City',
        country: 'Test Country'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);
      
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
    });
  });
});
