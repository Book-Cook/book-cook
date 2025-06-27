// Polyfills for Jest/MSW compatibility
const { TextDecoder, TextEncoder } = require('util');
const { ReadableStream, WritableStream, TransformStream } = require('stream/web');

// Set global polyfills
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.TransformStream = TransformStream;

// Mock BroadcastChannel for MSW
global.BroadcastChannel = class BroadcastChannel {
  constructor(name) {
    this.name = name;
  }
  
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};

// Mock window APIs for carousel library (only if window exists)
if (typeof window !== 'undefined') {
  // Mock matchMedia for carousel library
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock IntersectionObserver for carousel library
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock ResizeObserver for carousel library
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Import whatwg-fetch for fetch polyfill
require('whatwg-fetch');