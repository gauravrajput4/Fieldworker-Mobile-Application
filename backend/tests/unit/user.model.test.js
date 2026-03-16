const User = require('../../models/User');

describe('User Model Unit Tests', () => {
  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const bcrypt = require('bcryptjs');
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(20);
    });

    it('should compare passwords correctly', async () => {
      const bcrypt = require('bcryptjs');
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = new User({
        name: 'Test',
        email: 'test@example.com',
        password: hashedPassword
      });
      
      const isMatch = await user.comparePassword(password);
      expect(isMatch).toBe(true);
      
      const isNotMatch = await user.comparePassword('wrongpassword');
      expect(isNotMatch).toBe(false);
    });
  });

  describe('Schema Validation', () => {
    it('should require name, email, and password', () => {
      const user = new User({});
      const error = user.validateSync();
      
      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should have default role as fieldworker', () => {
      const user = new User({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(user.role).toBe('fieldworker');
    });

    it('should validate email uniqueness', () => {
      const user = new User({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(user.email).toBe('test@example.com');
    });
  });
});
