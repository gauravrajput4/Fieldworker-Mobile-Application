const request = require('supertest');
const app = require('../../src/app');
const User = require('../../models/User');
const Farmer = require('../../models/Farmer');
const Crop = require('../../models/Crop');
const mongoose = require('mongoose');

describe('End-to-End System Tests', () => {
  let authToken;
  let userId;
  let farmerId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/farmercrop_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Farmer.deleteMany({});
    await Crop.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Complete User Journey', () => {
    it('should complete full workflow: register -> login -> create farmer -> add crop -> sync', async () => {
      // Step 1: Register User
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'System Test User',
          email: 'system@test.com',
          password: 'password123'
        })
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      authToken = registerResponse.body.data.token;
      userId = registerResponse.body.data.user.id;

      // Step 2: Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'system@test.com',
          password: 'password123'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data.token).toBeDefined();

      // Step 3: Create Farmer with GPS
      const farmerResponse = await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'System Test Farmer',
          village: 'Test Village',
          mobile: '9876543210',
          latitude: 28.7041,
          longitude: 77.1025,
          address: 'Test Address'
        })
        .expect(201);

      expect(farmerResponse.body.success).toBe(true);
      farmerId = farmerResponse.body.data._id;

      // Step 4: Add Crop for Farmer
      const cropResponse = await request(app)
        .post('/api/crops')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          farmerId: farmerId,
          cropName: 'Wheat',
          cropType: 'Cereal',
          area: 5.5,
          season: 'Rabi',
          sowingDate: new Date('2024-11-01')
        })
        .expect(201);

      expect(cropResponse.body.success).toBe(true);
      expect(cropResponse.body.data.cropName).toBe('Wheat');

      // Step 5: Get All Farmers
      const farmersResponse = await request(app)
        .get('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(farmersResponse.body.data.length).toBe(1);

      // Step 6: Get Crops by Farmer
      const cropsResponse = await request(app)
        .get(`/api/crops/farmer/${farmerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(cropsResponse.body.data.length).toBe(1);

      // Step 7: Search Farmer
      const searchResponse = await request(app)
        .get('/api/farmers?search=System Test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(searchResponse.body.data.length).toBeGreaterThan(0);

      // Step 8: Update Farmer
      const updateResponse = await request(app)
        .put(`/api/farmers/${farmerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Farmer Name'
        })
        .expect(200);

      expect(updateResponse.body.data.name).toBe('Updated Farmer Name');

      // Step 9: Sync Data
      const syncResponse = await request(app)
        .post('/api/sync/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          deviceId: 'TEST-DEVICE-001',
          farmers: [],
          lastSync: new Date().toISOString()
        })
        .expect(200);

      expect(syncResponse.body.success).toBe(true);
    });
  });

  describe('Offline Sync Workflow', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Sync Test User',
          email: 'sync@test.com',
          password: 'password123'
        });

      authToken = response.body.data.token;
    });

    it('should sync multiple farmers from offline device', async () => {
      const offlineFarmers = [
        {
          name: 'Offline Farmer 1',
          village: 'Village 1',
          mobile: '9876543210',
          syncStatus: 'PENDING'
        },
        {
          name: 'Offline Farmer 2',
          village: 'Village 2',
          mobile: '9876543211',
          syncStatus: 'PENDING'
        }
      ];

      const syncResponse = await request(app)
        .post('/api/sync/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          deviceId: 'OFFLINE-DEVICE-001',
          farmers: offlineFarmers,
          lastSync: new Date().toISOString()
        })
        .expect(200);

      expect(syncResponse.body.success).toBe(true);
      expect(syncResponse.body.data.syncedFarmers.length).toBe(2);
    });
  });

  describe('Search and Filter System Test', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Search Test User',
          email: 'search@test.com',
          password: 'password123'
        });

      authToken = response.body.data.token;

      // Create multiple farmers
      await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Ramesh Kumar',
          village: 'Rampur',
          mobile: '9876543210'
        });

      await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Suresh Sharma',
          village: 'Shampur',
          mobile: '9876543211'
        });

      await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Mahesh Verma',
          village: 'Rampur',
          mobile: '9876543212'
        });
    });

    it('should search by name', async () => {
      const response = await request(app)
        .get('/api/farmers?search=Ramesh')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toContain('Ramesh');
    });

    it('should filter by village', async () => {
      const response = await request(app)
        .get('/api/farmers?village=Rampur')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(2);
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/farmers?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.totalPages).toBeDefined();
    });
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });
});
