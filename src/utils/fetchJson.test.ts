import { fetchJson } from './fetchJson';

/** Mocked fetch function */
const mockFetch = jest.fn();

global.fetch = mockFetch as any;

afterEach(() => {
  mockFetch.mockReset();
});

test('returns parsed json when response ok', async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ foo: 'bar' }),
    statusText: 'OK',
  });
  const data = await fetchJson<{ foo: string }>('test');
  expect(data).toEqual({ foo: 'bar' });
});

test('returns undefined for ok response with no json', async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: jest.fn().mockRejectedValue(new Error('no json')),
    statusText: 'OK',
  });
  const data = await fetchJson('test');
  expect(data).toBeUndefined();
});

test('throws error message from response body when not ok', async () => {
  mockFetch.mockResolvedValue({
    ok: false,
    json: jest.fn().mockResolvedValue({ message: 'Bad request' }),
    statusText: 'Bad',
  });
  await expect(fetchJson('test')).rejects.toThrow('Bad request');
});

test('throws statusText when body has no message', async () => {
  mockFetch.mockResolvedValue({
    ok: false,
    json: jest.fn().mockResolvedValue({}),
    statusText: 'Server error',
  });
  await expect(fetchJson('test')).rejects.toThrow('Server error');
});
