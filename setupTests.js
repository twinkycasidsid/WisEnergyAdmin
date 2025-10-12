// Global setup for Vitest + Chai (enables .to.equal, .to.exist, etc., in tests)
import { expect } from 'vitest'; // Vitest's expect (Chai-compatible)
import 'chai'; // Core Chai assertions
import 'chai-dom'; // DOM-specific Chai matchers (e.g., .to.exist, .to.be.visible, .to.have.class)
import '@testing-library/jest-dom';

// Make expect available globally (no need to import in test files)
global.expect = expect;

// Optional: Additional Chai config (e.g., for deeper equality checks)
// chai.config.truncateThreshold = 0; // Uncomment if long objects cause issues