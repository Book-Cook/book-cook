import { TestUsers } from "../factories";

/**
 * Authentication service for MSW testing
 */
export class AuthService {
  /**
   * Extract current user from request headers
   * In real app, this would validate JWT/session
   */
  static getCurrentUser(request: Request) {
    const userId = request.headers.get("x-user-id") || TestUsers.owner.id;
    const user = Object.values(TestUsers).find((u) => u.id === userId);
    return user || TestUsers.owner;
  }

  /**
   * Check if user is authenticated (always true in tests)
   */
  static isAuthenticated(request: Request): boolean {
    return true; // For testing purposes
  }

  /**
   * Simulate different auth states for testing
   */
  static mockUnauthenticated() {
    return { id: null, email: null, name: null };
  }
}
