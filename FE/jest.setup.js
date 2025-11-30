require("@testing-library/jest-dom");

if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");

  global.TextEncoder = TextEncoder;

  global.TextDecoder = TextDecoder;
}

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}
