/** @jest-environment node */

jest.mock('../auth/[...nextauth]', () => ({ authOptions: {} }));
jest.mock('src/utils', () => ({ getDb: jest.fn() }));
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));

import handler from './suggestMeals';
import { getDb } from 'src/utils';
import { getServerSession } from 'next-auth';

const mockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
  } as any;
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('/api/ai/suggestMeals', () => {
  test('rejects non-POST requests', async () => {
    const req = { method: 'GET' } as any;
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  test('returns 400 when ingredients missing', async () => {
    const req = { method: 'POST', body: {} } as any;
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns recipes on success', async () => {
    const req = { method: 'POST', body: { ingredients: ['egg'] } } as any;
    const res = mockRes();

    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1', email: 't' } });

    const toArrayRecipes = jest.fn().mockResolvedValue([{ _id: 'r1', title: 'Recipe' }]);
    const findRecipes = jest.fn().mockReturnValue({ limit: () => ({ toArray: toArrayRecipes }) });

    const toArrayUsers = jest.fn().mockResolvedValue([]);
    const findUsers = jest.fn().mockReturnValue({ map: () => ({ toArray: toArrayUsers }) });

    const collection = jest.fn((name: string) =>
      name === 'recipes' ? { find: findRecipes } : { find: findUsers }
    );
    (getDb as jest.Mock).mockResolvedValue({ collection });

    await handler(req, res);

    expect(findRecipes).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ recipes: [{ _id: 'r1', title: 'Recipe' }] });
  });
});
