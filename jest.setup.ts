import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

const mockClient = { close: jest.fn() };
jest.mock("src/clients/mongo", () => ({
  __esModule: true,
  default: Promise.resolve(mockClient),
}));

afterAll(() => mockClient.close());
