import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import "cross-fetch/polyfill";
import { server } from "./src/mocks/server";

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

const mockClient = { close: jest.fn() };
jest.mock("src/clients/mongo", () => ({
  __esModule: true,
  default: Promise.resolve(mockClient),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());

afterAll(() => {
  server.close();
  mockClient.close();
});
