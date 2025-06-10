/** @jest-environment node */

import handler from './suggestMeals';
import { processWithAI } from '../../../server';

jest.mock('../../../server', () => ({
  processWithAI: jest.fn(),
}));

describe('/api/ai/suggestMeals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rejects non-POST requests', async () => {
    const req = { method: 'GET' } as any;
    const res = await handler(req);
    const body = await res.json();
    expect(res.status).toBe(405);
    expect(body).toEqual({ message: 'Method Not Allowed' });
  });

  test('returns 400 when ingredients missing', async () => {
    const req = { method: 'POST', json: jest.fn().mockResolvedValue({}) } as any;
    const res = await handler(req);
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body).toEqual({ message: 'Missing or invalid ingredients in request body' });
  });

  test('returns suggestions on success', async () => {
    const req = { method: 'POST', json: jest.fn().mockResolvedValue({ ingredients: ['egg', 'flour'] }) } as any;
    (processWithAI as jest.Mock).mockResolvedValue({ processedContent: 'ideas' });
    const res = await handler(req);
    const body = await res.json();

    expect(processWithAI).toHaveBeenCalledWith({
      systemPrompt: expect.any(String),
      userPrompt: '- egg\n- flour',
    });
    expect(res.status).toBe(200);
    expect(body).toEqual({ suggestions: 'ideas' });
  });
});
