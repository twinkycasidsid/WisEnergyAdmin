// jest.config.cjs
module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["js", "jsx", "json", "node", "mjs"], // Add your setup file here
  moduleDirectories: ["node_modules", "services"], // Add "services" here
};
