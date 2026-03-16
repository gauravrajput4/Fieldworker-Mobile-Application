const Farmer = require('../../models/Farmer');

describe('Farmer Model Unit Tests', () => {
  describe('Schema Validation', () => {
    it('should create a valid farmer', () => {
      const validFarmer = {
        name: 'Test Farmer',
        village: 'Test Village',
        mobile: '9876543210',
        createdBy: '507f1f77bcf86cd799439011'
      };
      
      const farmer = new Farmer(validFarmer);
      const error = farmer.validateSync();
      
      expect(error).toBeUndefined();
      expect(farmer.name).toBe('Test Farmer');
      expect(farmer.syncStatus).toBe('SYNCED');
    });

    it('should fail without required fields', () => {
      const invalidFarmer = new Farmer({});
      const error = invalidFarmer.validateSync();
      
      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.village).toBeDefined();
      expect(error.errors.mobile).toBeDefined();
    });

    it('should have default syncStatus as SYNCED', () => {
      const farmer = new Farmer({
        name: 'Test',
        village: 'Village',
        mobile: '9876543210',
        createdBy: '507f1f77bcf86cd799439011'
      });
      
      expect(farmer.syncStatus).toBe('SYNCED');
    });

    it('should accept optional latitude and longitude', () => {
      const farmer = new Farmer({
        name: 'Test',
        village: 'Village',
        mobile: '9876543210',
        latitude: 28.7041,
        longitude: 77.1025,
        createdBy: '507f1f77bcf86cd799439011'
      });
      
      expect(farmer.latitude).toBe(28.7041);
      expect(farmer.longitude).toBe(77.1025);
    });
  });
});
