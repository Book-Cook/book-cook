jest.mock("../../../pages/api/auth/[...nextauth]", () => ({
  authOptions: {},
}));
jest.mock("src/utils/db", () => ({ getDb: jest.fn() }));
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));

import type { Db } from "mongodb";
import { getServerSession } from "next-auth";
import { createMocks } from "node-mocks-http";

import { getDb } from "src/utils/db";

import handler from "../../../pages/api/recipes/tags";

const mockGetDb = getDb as jest.MockedFunction<typeof getDb>;
const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

const USER_ID = "user-1";

const makeDb = (sharedOwnerIds: string[], tags: string[]) => {
  const aggregate = jest.fn().mockReturnValue({
    toArray: jest.fn().mockResolvedValue(tags.map((tag) => ({ _id: tag }))),
  });
  const usersFind = jest.fn().mockReturnValue({
    map: (fn: (user: { _id: { toString: () => string } }) => string) => ({
      toArray: jest
        .fn()
        .mockResolvedValue(
          sharedOwnerIds.map((id) => fn({ _id: { toString: () => id } })),
        ),
    }),
  });
  const collection = jest.fn((name: string) =>
    name === "users" ? { find: usersFind } : { aggregate },
  );
  return { db: { collection }, aggregate };
};

describe("GET /api/recipes/tags", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerSession.mockResolvedValue({
      user: { id: USER_ID, email: "user@example.com" },
    });
  });

  it("returns 401 without a session", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const { req, res } = createMocks({ method: "GET" });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
  });

  it("returns 405 for non-GET methods", async () => {
    const { req, res } = createMocks({ method: "POST" });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });

  it("scopes tags to own and shared recipes, excluding other public ones", async () => {
    const { db, aggregate } = makeDb(["owner-2"], ["dinner", "vegan"]);
    mockGetDb.mockResolvedValue(db as unknown as Db);

    const { req, res } = createMocks({ method: "GET" });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(["dinner", "vegan"]);
    const [pipeline] = aggregate.mock.calls[0] as [
      Array<Record<string, unknown>>,
    ];
    expect(pipeline[0]).toEqual({
      $match: {
        $or: [{ owner: USER_ID }, { owner: { $in: ["owner-2"] } }],
      },
    });
  });
});
