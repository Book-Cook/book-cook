/**
 * Clean user data abstraction
 */

export interface MockUser {
  id: string;
  email: string;
  name: string;
}

export const testUser: MockUser = {
  id: "user_123",
  email: "test@example.com",
  name: "Test User",
};

export const sharedUser: MockUser = {
  id: "user_456",
  email: "shared@example.com",
  name: "Shared User",
};

export const collaboratorUser: MockUser = {
  id: "user_789",
  email: "collaborator@example.com",
  name: "Recipe Collaborator",
};

/**
 * All users collection
 */
export const allUsers = [testUser, sharedUser, collaboratorUser];

/**
 * User lookup by ID
 */
export const UserLookup = {
  [testUser.id]: testUser,
  [sharedUser.id]: sharedUser,
  [collaboratorUser.id]: collaboratorUser,
} as const;

/**
 * User lookup by email
 */
export const UserByEmail = {
  [testUser.email]: testUser,
  [sharedUser.email]: sharedUser,
  [collaboratorUser.email]: collaboratorUser,
} as const;
