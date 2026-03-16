const Crop = require('../../models/Crop');

describe('Crop Model Unit Tests', () => {
  describe('Schema Validation', () => {
    it('should create a valid crop', () => {
      const validCrop = {
        farmerId: '507f1f77bcf86cd799439011',
        cropName: 'Wheat',
        cropType: 'Cereal',
        area: 5.5,
        season: 'Rabi',
        sowingDate: new Date('2024-11-01'),
        createdBy: '507f1f77bcf86cd799439011'
      };
      
      const crop = new Crop(validCrop);
      const error = crop.validateSync();
      
      expect(error).toBeUndefined();
      expect(crop.cropName).toBe('Wheat');
      expect(crop.area).toBe(5.5);
    });

    it('should fail without required fields', () => {
      const invalidCrop = new Crop({});
      const error = invalidCrop.validateSync();
      
      expect(error).toBeDefined();
      expect(error.errors.farmerId).toBeDefined();
      expect(error.errors.cropName).toBeDefined();
      expect(error.errors.cropType).toBeDefined();
    });

    it('should have default syncStatus as SYNCED', () => {
      const crop = new Crop({
        farmerId: '507f1f77bcf86cd799439011',
        cropName: 'Rice',
        cropType: 'Cereal',
        area: 3.0,
        season: 'Kharif',
        sowingDate: new Date()
      });
      
      expect(crop.syncStatus).toBe('SYNCED');
    });

    it('should accept optional imagePath', () => {
      const crop = new Crop({
        farmerId: '507f1f77bcf86cd799439011',
        cropName: 'Corn',
        cropType: 'Cereal',
        area: 2.5,
        season: 'Kharif',
        sowingDate: new Date(),
        imagePath: '/uploads/crop_images/test.jpg'
      });
      
      expect(crop.imagePath).toBe('/uploads/crop_images/test.jpg');
    });
  });
});
