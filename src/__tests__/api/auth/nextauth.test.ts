jest.mock("src/utils/db", () => ({ getDb: jest.fn() }));
// next-auth's entrypoint pulls in ESM-only crypto deps that jest cannot parse,
// so stub the wiring and exercise the real `authOptions` callbacks.
jest.mock("next-auth", () => ({ __esModule: true, default: jest.fn() }));
jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: jest.fn(() => ({ id: "google" })),
}));

import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

import { getDb } from "src/utils/db";

import { authOptions } from "../../../pages/api/auth/[...nextauth]";

const findOne = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (getDb as jest.Mock).mockResolvedValue({
    collection: () => ({ findOne }),
  });
});

const runJwt = (token: JWT) =>
  authOptions.callbacks?.jwt?.({ token } as never) as Promise<JWT>;

const runSession = (session: Session, token: JWT) =>
  authOptions.callbacks?.session?.({
    session,
    token,
  } as never) as Promise<Session>;

describe("auth callbacks", () => {
  it("resolves the user id once and caches it on the token", async () => {
    findOne.mockResolvedValue({ _id: "user-123" });

    const token = await runJwt({ email: "cook@example.com" });

    expect(token.userId).toBe("user-123");
    expect(findOne).toHaveBeenCalledTimes(1);
  });

  it("does not touch the database once the token carries the user id", async () => {
    await runJwt({ email: "cook@example.com", userId: "user-123" });

    expect(getDb).not.toHaveBeenCalled();
    expect(findOne).not.toHaveBeenCalled();
  });

  it("retries the lookup when the user document does not exist yet", async () => {
    // events.signIn creates the user document *after* callbacks.jwt runs, so a
    // brand-new account must not cache a missing id permanently.
    findOne.mockResolvedValueOnce(null);
    const first = await runJwt({ email: "new@example.com" });
    expect(first.userId).toBeUndefined();

    findOne.mockResolvedValueOnce({ _id: "user-456" });
    const second = await runJwt(first);
    expect(second.userId).toBe("user-456");
  });

  it("keeps the user signed in when the lookup fails", async () => {
    // Throwing out of the callback makes NextAuth return an empty session,
    // which signs the user out over a transient database blip.
    (getDb as jest.Mock).mockRejectedValueOnce(new Error("connection refused"));
    jest.spyOn(console, "error").mockImplementation(() => {});

    const token = await runJwt({ email: "cook@example.com", name: "Cook" });

    expect(token.name).toBe("Cook");
    expect(token.userId).toBeUndefined();
  });

  it("builds the session from the token without querying the database", async () => {
    const session = { user: { email: "cook@example.com" } } as Session;

    const result = await runSession(session, {
      email: "cook@example.com",
      userId: "user-123",
    });

    expect(result.user.id).toBe("user-123");
    expect(getDb).not.toHaveBeenCalled();
  });
});
