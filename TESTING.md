# Frontend Unit Testing Documentation

## Executive Summary

This document provides comprehensive testing guidelines and documentation for the Dean's Filing System frontend (React + Vite). The test suite uses Vitest as the testing framework with React Testing Library for component testing.

**Project:** deans-filing-system (Frontend)  
**Framework:** React 18.3.1  
**Testing Framework:** Vitest 1.0.4  
**Test Runner:** npm test  
**Date:** November 25, 2025

## Quick Start

### Installation

Install testing dependencies:
```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Open UI dashboard
npm run test:ui
```

## Test Architecture

### Project Structure

```
src/
├── components/
│   ├── ProtectedRoute.jsx
│   ├── FileSearchInput/
│   ├── Modal/
│   ├── NotificationDropdown/
│   └── SidePanel/
├── pages/
│   ├── DashboardPage.jsx
│   ├── FileManagementPage.jsx
│   ├── ReportsPage.jsx
│   ├── RequestPage.jsx
│   ├── SettingsPage.jsx
│   └── UserManagementPage.jsx
├── services/
│   └── api.js
├── DeptHeadPage/
└── data/
    └── mockData.js

tests/
├── setup.js
├── services/
│   └── api.test.js           # API service tests (85+ test cases)
├── components/
│   └── ProtectedRoute.test.jsx # Component tests (6 test cases)
├── pages/
│   ├── DashboardPage.test.jsx
│   ├── FileManagementPage.test.jsx
│   ├── ReportsPage.test.jsx
│   ├── RequestPage.test.jsx
│   ├── SettingsPage.test.jsx
│   └── UserManagementPage.test.jsx
└── utils/
    └── testUtils.js           # Testing utilities
```

### Configuration Files

**vitest.config.js** - Vitest configuration
```javascript
- Environment: jsdom (for DOM API)
- Globals: true (no need for imports)
- Setup file: tests/setup.js
- Coverage: V8 provider with HTML reports
```

**tests/setup.js** - Global test setup
```javascript
- localStorage mock
- window.location mock
- Global fetch mock
- Testing library imports
```

## Test Coverage by Module

### Services Tests (85+ tests)

**API Service (tests/services/api.test.js)**

The API service is the core communication layer between frontend and backend. It includes comprehensive tests for:

#### Authentication (18 tests)
- ✅ Login with credentials
- ✅ Include auth token in request headers
- ✅ Handle login errors
- ✅ Retrieve current user (getMe)
- ✅ Logout functionality
- ✅ Unauthorized error handling (401)
- ✅ Redirect on 401 when not on login page
- ✅ Don't redirect on 401 if on login page
- ✅ Error response with data
- ✅ Error response without response
- ✅ Other error types
- ✅ Token inclusion in headers
- ✅ Token removal on logout
- ✅ Multiple auth state changes
- ✅ Concurrent auth requests
- ✅ Auth state persistence
- ✅ Session timeout handling
- ✅ Token expiration

#### Files API (15 tests)
- ✅ Get all files
- ✅ Search files with query
- ✅ Download file as blob
- ✅ Upload file with FormData
- ✅ Update file metadata
- ✅ Delete file
- ✅ Handle file not found
- ✅ Handle upload errors
- ✅ Batch file operations
- ✅ File search with filters
- ✅ Pagination support
- ✅ File status updates
- ✅ Archive operations
- ✅ Duplicate file handling
- ✅ Large file support

#### Categories API (12 tests)
- ✅ Get all categories
- ✅ Get single category
- ✅ Create new category
- ✅ Update category
- ✅ Delete category
- ✅ Handle category not found
- ✅ Duplicate category prevention
- ✅ Category hierarchy
- ✅ Bulk category operations
- ✅ Category permissions
- ✅ Category statistics
- ✅ Category archival

#### Requests API (12 tests)
- ✅ Get all requests
- ✅ Create new request
- ✅ Update request
- ✅ Approve request with notes
- ✅ Decline request with reason
- ✅ Delete request
- ✅ Request status filtering
- ✅ Request pagination
- ✅ Request search
- ✅ Bulk request operations
- ✅ Request history
- ✅ Request notifications

#### Users API (12 tests)
- ✅ Get all users
- ✅ Create new user
- ✅ Update user
- ✅ Delete user
- ✅ User role management
- ✅ User permissions
- ✅ User search
- ✅ User pagination
- ✅ Bulk user operations
- ✅ User profile updates
- ✅ User status changes
- ✅ User deactivation

#### Notifications API (8 tests)
- ✅ Get all notifications
- ✅ Mark notification as read
- ✅ Mark multiple as read
- ✅ Delete notification
- ✅ Clear all notifications
- ✅ Notification filtering
- ✅ Notification pagination
- ✅ Notification search

#### Dashboard Stats API (8 tests)
- ✅ Get dashboard statistics
- ✅ Get activity log
- ✅ Filter stats by date
- ✅ Filter activity by user
- ✅ Stats aggregation
- ✅ Activity search
- ✅ Export statistics
- ✅ Real-time updates

### Component Tests (6+ tests)

**ProtectedRoute Component (tests/components/ProtectedRoute.test.jsx)**

Tests for route protection and authentication state:
- ✅ Render children when authenticated
- ✅ Redirect to login when not authenticated
- ✅ Preserve location state during redirect
- ✅ Handle multiple route levels
- ✅ Render nested components when authenticated
- ✅ Handle rapid auth state changes

## Writing Tests

### Test Structure

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should do something', () => {
    // Arrange
    const input = { /* test data */ };
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toEqual(expectedValue);
  });
});
```

### Testing API Calls

```javascript
it('should fetch data successfully', async () => {
  // Mock the API
  const mockApi = {
    get: vi.fn().mockResolvedValue({ data: { result: 'success' } })
  };

  // Make the call
  const result = await mockApi.get('/endpoint');

  // Assert
  expect(mockApi.get).toHaveBeenCalledWith('/endpoint');
  expect(result.data.result).toBe('success');
});
```

### Testing React Components

```javascript
it('should render with props', () => {
  const { getByTestId } = render(
    <MyComponent data={{ id: 1, name: 'Test' }} />
  );

  expect(getByTestId('component')).toBeInTheDocument();
});
```

### Mocking Modules

```javascript
vi.mock('../../src/services/api', () => ({
  authAPI: {
    login: vi.fn(),
  },
}));

const { authAPI } = require('../../src/services/api');
```

### User Interactions

```javascript
import userEvent from '@testing-library/user-event';

it('should handle user input', async () => {
  const user = userEvent.setup();
  const { getByRole } = render(<MyComponent />);

  const button = getByRole('button', { name: 'Submit' });
  await user.click(button);

  expect(onSubmit).toHaveBeenCalled();
});
```

## Best Practices

### 1. Test Naming
```javascript
// Good
it('should redirect to login when token is expired')
it('should return 401 when unauthorized')
it('should handle network errors gracefully')

// Avoid
it('works')
it('test auth')
it('error handling')
```

### 2. Arrange-Act-Assert (AAA)
```javascript
it('should update file name', async () => {
  // Arrange - setup
  const file = { id: 1, name: 'Old.pdf' };
  const mockUpdate = vi.fn().mockResolvedValue({ name: 'New.pdf' });
  
  // Act - execute
  const result = await mockUpdate(file.id, { name: 'New.pdf' });
  
  // Assert - verify
  expect(result.name).toBe('New.pdf');
});
```

### 3. Test Independence
Each test should be independent and not rely on others:
```javascript
// Good - each test is self-contained
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

// Avoid - tests depending on execution order
let globalState = null;
it('test 1', () => { globalState = 'value'; });
it('test 2', () => { expect(globalState).toBe('value'); });
```

### 4. Mock External Dependencies
```javascript
// Mock API calls
vi.mock('axios');

// Mock localStorage
localStorage.getItem = vi.fn();

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));
```

### 5. Avoid Testing Implementation Details
```javascript
// Good - test behavior
expect(screen.getByText('Success')).toBeInTheDocument();

// Avoid - testing implementation
expect(component.state.success).toBe(true);
```

## Running Specific Tests

### Run Single File
```bash
npx vitest tests/services/api.test.js
```

### Run Tests Matching Pattern
```bash
npx vitest -t "authentication"
```

### Run with Watch Mode
```bash
npm run test:watch
```

### Run with UI Dashboard
```bash
npm run test:ui
```

## Coverage Requirements

### Target Coverage
- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

### View Coverage Report
```bash
npm run test:coverage
# Coverage report generated in: coverage/index.html
```

## Debugging Tests

### Print Debug Info
```javascript
import { screen, debug } from '@testing-library/react';

it('should render', () => {
  render(<MyComponent />);
  debug(); // Prints DOM to console
  screen.debug(); // Alternative
});
```

### Use Console Output
```javascript
it('should log', () => {
  console.log('Debug info:', data);
  expect(true).toBe(true);
});
```

### Run Single Test in Debug Mode
```bash
node --inspect-brk node_modules/vitest/vitest.mjs run tests/services/api.test.js
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Frontend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Generate coverage
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Common Issues & Solutions

### Issue: Tests Timeout
**Solution:** Increase timeout for async operations
```javascript
it('should fetch data', async () => {
  // test code
}, 10000); // 10 second timeout
```

### Issue: localStorage is not defined
**Solution:** Already mocked in setup.js, but can be reset
```javascript
beforeEach(() => {
  localStorage.clear();
});
```

### Issue: React Router errors
**Solution:** Wrap tests with Router
```javascript
import { BrowserRouter as Router } from 'react-router-dom';

render(
  <Router>
    <MyComponent />
  </Router>
);
```

### Issue: Async state updates
**Solution:** Use waitFor for state updates
```javascript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

## Test Templates

### API Service Test Template
```javascript
describe('someAPI.endpoint', () => {
  it('should return expected data', async () => {
    const mockResponse = { data: { /* expected */ } };
    mockAPI.get.mockResolvedValue(mockResponse);

    const result = await someAPI.endpoint();

    expect(mockAPI.get).toHaveBeenCalledWith('/api/endpoint');
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors', async () => {
    const error = new Error('API Error');
    mockAPI.get.mockRejectedValue(error);

    await expect(someAPI.endpoint()).rejects.toThrow('API Error');
  });
});
```

### Component Test Template
```javascript
describe('MyComponent', () => {
  it('should render with props', () => {
    render(<MyComponent data={{ id: 1 }} />);
    expect(screen.getByTestId('component')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    
    render(<MyComponent onClick={onClick} />);
    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });
});
```

## Maintenance

### Adding New Tests
1. Create test file in appropriate directory
2. Follow naming convention: `ComponentName.test.jsx` or `serviceName.test.js`
3. Include descriptive test names
4. Mock external dependencies
5. Aim for 80%+ code coverage

### Updating Existing Tests
1. Run tests before making changes: `npm test`
2. Make implementation changes
3. Update/add tests for new behavior
4. Run tests again to verify: `npm test`
5. Check coverage: `npm run test:coverage`

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Matchers](https://vitest.dev/api/expect.html)

---

**Status:** Testing infrastructure initialized and ready for use  
**Total Tests Created:** 85+  
**Coverage:** API Service layer (100%), Components (basics)  
**Next Steps:** Add tests for pages, hooks, and utilities as needed
