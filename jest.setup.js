// jest.setup.js
import { TextEncoder, TextDecoder } from "util";

// Make TextEncoder and TextDecoder available in Jest environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
