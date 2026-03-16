const request = require('supertest');
const app = require('../../src/app');
const User = require('../../models/User');
const Farmer = require('../../models/Farmer');
const mongoose = require('mongoose');

describe('Farmer API Integration Tests', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/farmercrop_test';
    await mongoose.connect(mongoUri);

    // Create test user and get token
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = response.body.data.token;
    userId = response.body.data.user.id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Farmer.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Farmer.deleteMany({});
  });

  describe('POST /api/farmers', () => {
    it('should create a new farmer with authentication', async () => {
      const farmerData = {
        name: 'Test Farmer',
        village: 'Test Village',
        mobile: '9876543210',
        address: 'Test Address'
      };

      const response = await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(farmerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(farmerData.name);
      expect(response.body.data.village).toBe(farmerData.village);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/farmers')
        .send({
          name: 'Test Farmer',
          village: 'Test Village',
          mobile: '9876543210'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should create farmer with GPS coordinates', async () => {
      const farmerData = {
        name: 'GPS Farmer',
        village: 'GPS Village',
        mobile: '9876543210',
        latitude: 28.7041,
        longitude: 77.1025
      };

      const response = await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(farmerData)
        .expect(201);

      expect(response.body.data.latitude).toBe(28.7041);
      expect(response.body.data.longitude).toBe(77.1025);
    });
  });

  describe('GET /api/farmers', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Farmer 1',
          village: 'Village 1',
          mobile: '9876543210'
        });

      await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Farmer 2',
          village: 'Village 2',
          mobile: '9876543211'
        });
    });

    it('should get all farmers for authenticated user', async () => {
      const response = await request(app)
        .get('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should search farmers by name', async () => {
      const response = await request(app)
        .get('/api/farmers?search=Farmer 1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toContain('Farmer 1');
    });

    it('should filter farmers by village', async () => {
      const response = await request(app)
        .get('/api/farmers?village=Village 1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].village).toContain('Village 1');
    });
  });

  describe('PUT /api/farmers/:id', () => {
    let farmerId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Original Name',
          village: 'Original Village',
          mobile: '9876543210'
        });

      farmerId = response.body.data._id;
    });

    it('should update farmer details', async () => {
      const response = await request(app)
        .put(`/api/farmers/${farmerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          village: 'Updated Village'
        })
        .expect(200);

      expect(response.body.data.name).toBe('Updated Name');
      expect(response.body.data.village).toBe('Updated Village');
    });
  });

  describe('DELETE /api/farmers/:id', () => {
    let farmerId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'To Delete',
          village: 'Delete Village',
          mobile: '9876543210'
        });

      farmerId = response.body.data._id;
    });

    it('should delete farmer', async () => {
      await request(app)
        .delete(`/api/farmers/${farmerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response = await request(app)
        .get('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.body.data.length).toBe(0);
    });
  });
});
