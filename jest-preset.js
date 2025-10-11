// jest-preset.js
export default {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',  // Ensure JSX files are transformed using Babel
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'], // Allow Jest to resolve files with these extensions
    testEnvironment: 'jest-environment-jsdom', // Simulate the DOM environment for React tests
    setupFilesAfterEnv: ['@testing-library/jest-dom'], // Extend Jest with custom matchers
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Adjust module aliasing if needed
    },
};
