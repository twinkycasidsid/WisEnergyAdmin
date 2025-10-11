export default {
    preset: './jest-preset.js',  // Reference the custom preset
    testEnvironment: 'jest-environment-jsdom', // Ensure this is correctly specified
    setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js', // Path to your jest setup file
        '@testing-library/jest-dom', // Correct import for jest-dom
    ],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',  // Use Babel to handle JSX files
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Adjust module aliasing if needed
    },
};
