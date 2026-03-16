# Testing Documentation

## Test Structure

```
tests/
├── unit/           # Unit tests for models
├── integration/    # API integration tests
└── system/         # End-to-end system tests
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode
```bash
npm run test:watch
```

## Test Coverage

Run tests with coverage report:
```bash
npm test
```

Coverage report will be generated in `coverage/` directory.

## Test Database

Tests use a separate test database: `farmercrop_test`

Set custom test database:
```bash
export MONGODB_TEST_URI=mongodb://localhost:27017/your_test_db
```

## Unit Tests

### User Model Tests
- Password hashing
- Password comparison
- Schema validation
- Default values

### Farmer Model Tests
- Schema validation
- Required fields
- Optional fields (GPS coordinates)
- Default sync status

### Crop Model Tests
- Schema validation
- Required fields
- Optional image path
- Default sync status

## Integration Tests

### Auth API Tests
- User registration
- User login
- Duplicate email handling
- Invalid credentials

### Farmer API Tests
- Create farmer with authentication
- Get all farmers
- Search farmers
- Filter by village
- Update farmer
- Delete farmer
- GPS coordinates handling

## System Tests (E2E)

### Complete User Journey
1. Register user
2. Login
3. Create farmer with GPS
4. Add crop
5. Get all farmers
6. Search farmers
7. Update farmer
8. Sync data

### Offline Sync Workflow
- Sync multiple farmers
- Handle pending sync status
- Device ID tracking

### Search and Filter
- Search by name
- Filter by village
- Pagination

## Test Results

Expected coverage: 70%+
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## CI/CD Integration

Add to GitHub Actions:
```yaml
- name: Run Tests
  run: npm test
```

## Troubleshooting

### MongoDB Connection Issues
Ensure MongoDB is running:
```bash
mongod --dbpath /path/to/data
```

### Port Already in Use
Kill existing process:
```bash
lsof -ti:5000 | xargs kill -9
```

### Test Timeout
Increase timeout in jest.config.js:
```javascript
testTimeout: 30000
```
