// jest.setup.js
import { TextEncoder, TextDecoder } from "util";
import '@testing-library/jest-dom';

// Make TextEncoder and TextDecoder available in Jest environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// jest.setup.js
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
