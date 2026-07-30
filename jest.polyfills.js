// Polyfills for Jest/MSW compatibility
const { Blob, File } = require("buffer");
const {
  ReadableStream,
  WritableStream,
  TransformStream,
} = require("stream/web");
const { TextDecoder, TextEncoder } = require("util");

class MessagePort {
  postMessage() {}
  close() {}
  start() {}
  addEventListener() {}
  removeEventListener() {}
}

class MessageChannel {
  constructor() {
    this.port1 = new MessagePort();
    this.port2 = new MessagePort();
  }
}

Object.assign(global, {
  Blob,
  File,
  MessageChannel,
  MessagePort,
  ReadableStream,
  TextDecoder,
  TextEncoder,
  TransformStream,
  WritableStream,
});

global.BroadcastChannel = class BroadcastChannel {
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};

const {
  fetch,
  FormData,
  Headers,
  Request,
  Response,
} = require("undici");

Object.assign(global, {
  fetch,
  FormData,
  Headers,
  Request,
  Response,
});

// Mock window APIs for carousel library (only if window exists)
if (typeof window !== "undefined") {
  // Mock matchMedia for carousel library
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
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
