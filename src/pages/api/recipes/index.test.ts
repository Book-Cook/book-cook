/** @jest-environment node */

jest.mock("../auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("src/utils", () => ({ getDb: jest.fn() }));
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));

import { getServerSession } from "next-auth";

import { getDb } from "src/utils";
import handler from "./index";

const mockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("/api/recipes", () => {
  test("GET invalid sort parameter returns 400", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { method: "GET", query: { sortProperty: "invalid" } } as any;
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid sorting parameters.",
    });
  });

  test("POST without session returns 401", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { method: "POST", body: { title: "Test" } } as any;
    const res = mockRes();

    (getServerSession as jest.Mock).mockResolvedValue(null);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("POST with session inserts recipe", async () => {
    const req = {
      method: "POST",
      body: { title: "Title", data: {}, tags: [] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const res = mockRes();

    const insertOne = jest.fn().mockResolvedValue({ insertedId: "123" });
    const db = { collection: jest.fn().mockReturnValue({ insertOne }) };
    (getDb as jest.Mock).mockResolvedValue(db);
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user1" },
    });

    await handler(req, res);

    expect(insertOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Recipe uploaded successfully.",
      recipeId: "123",
    });
  });
});
